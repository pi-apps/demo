import { useCallback, useRef, useState } from "react";
import { scValToNative } from "@stellar/stellar-base";
import type { ContractSubscription } from "../../types/pi";
import { toJSON } from "../../utils/toJSON";
import { waitForTransaction } from "../useSubscriptions";
import { read } from "./chainReads";
import { errorText, periodsFor, type Plan } from "./plans";

type Choice = { plan: Plan; autoRenew: boolean };

export type SubscribeFlow =
  | { phase: "idle" }
  | ({ phase: "signing" } & Choice)
  | ({ phase: "confirming"; seconds: number } & Choice)
  | ({ phase: "success" } & Choice)
  // The contract refused because the wallet already has this plan (AlreadySubscribed): an earlier attempt that
  // landed late, or a plan that ran out with auto renew on and waits for its renewal. The re-read tells which.
  | ({ phase: "already" } & Choice)
  // the transaction landed and the network rejected it, or it never landed and its lifetime ran out (expired)
  | ({ phase: "failed"; details: string; expired?: boolean } & Choice)
  // the SDK threw in the wallet or on submit, so the transaction may or may not have been sent
  | ({ phase: "error"; details: string } & Choice)
  // Not seen landing within the wait, or the wait itself failed: it may still go through, so it is not reported as
  // failed. It stays pending, with its transaction, until a check finds it landed, failed or expired, so nothing new
  // is started over it.
  | ({ phase: "unconfirmed"; hash: string; expiresAt: number } & Choice);

// waiting on the wallet or the network, so the choice cannot change
export const isBusy = (flow: SubscribeFlow) => flow.phase === "signing" || flow.phase === "confirming";

export type PendingCheck = "landed" | "failed" | "notYet" | "unknown";

// The SDK builds every transaction to expire 180 seconds after it is built, and building happens before signing,
// so 180 seconds after submitting is a safe upper bound: one still not found after that can no longer land.
const TRANSACTION_LIFETIME_MS = 180_000;

// The subscription the contract created: the plan as charged, without its trial if the contract gave none (it does
// not give a wallet a second one), so the success screen never promises a free trial that was not granted.
const landed = (choice: Choice, result: ContractSubscription | undefined): SubscribeFlow => {
  const trialGranted = !result || Number(result.trial_end_ts) > 0;
  const plan = trialGranted ? choice.plan : { ...choice.plan, trialSecs: 0 };
  return { phase: "success", plan, autoRenew: choice.autoRenew };
};

// Waits for an accepted transaction. Its hash is known from here on, so a wait that fails leaves it pending, to be
// checked by its hash, rather than an unknown outcome that invites a second attempt.
const confirm = async (
  choice: Choice,
  hash: string,
  onSecondPassed: (seconds: number) => void
): Promise<SubscribeFlow> => {
  const expiresAt = Date.now() + TRANSACTION_LIFETIME_MS;
  try {
    const tx = await waitForTransaction(hash, onSecondPassed);
    if (tx.status === "SUCCESS") return landed(choice, tx.result);
    if (tx.status === "FAILED") return { phase: "failed", ...choice, details: toJSON(tx) };
  } catch (err) {
    console.error("Error waiting for the subscription to land:", err);
  }
  return { phase: "unconfirmed", ...choice, hash, expiresAt };
};

// key: the session and wallet the attempt belongs to (null when there is no wallet); onSettled: re-read the
// subscription, since the contract is the record of whether the user is now subscribed
export const useSubscribeAttempt = (walletAddress: string | null, key: string | null, onSettled: () => void) => {
  const [attempt, setAttempt] = useState<{ key: string | null; flow: SubscribeFlow }>({
    key: null,
    flow: { phase: "idle" },
  });
  // the latest run: one overtaken by a newer run or a reset stops writing (an attempt from another session or
  // wallet is hidden by its key instead, see `flow` below)
  const run = useRef(0);

  const subscribe = useCallback(
    async (plan: Plan, autoRenew: boolean) => {
      if (!walletAddress || !key) {
        return;
      }
      const thisRun = ++run.current;
      const isCurrent = () => thisRun === run.current;
      const setFlow = (flow: SubscribeFlow) => isCurrent() && setAttempt({ key, flow });
      setFlow({ phase: "signing", plan, autoRenew });
      try {
        const { Subscription } = window.Pi.SmartContract;
        const submitted = await Subscription.subscribe(
          walletAddress,
          plan.serviceId,
          autoRenew,
          String(periodsFor(plan, autoRenew))
        );
        setFlow({ phase: "confirming", plan, autoRenew, seconds: 0 });
        setFlow(
          await confirm({ plan, autoRenew }, submitted.hash, seconds =>
            setFlow({ phase: "confirming", plan, autoRenew, seconds })
          )
        );
      } catch (err) {
        const details = errorText(err);
        // Reject in the Pi Wallet: back to the plan, nothing to report
        if (details.includes("User rejected.")) {
          setFlow({ phase: "idle" });
          return;
        }
        console.error("Error subscribing:", err);
        // the contract's AlreadySubscribed (#3) is a definite answer, not an unknown outcome
        const already = /AlreadySubscribed|Error\(Contract, #3\)/.test(details);
        setFlow(already ? { phase: "already", plan, autoRenew } : { phase: "error", plan, autoRenew, details });
      }
      if (isCurrent()) {
        onSettled();
      }
    },
    [walletAddress, key, onSettled]
  );

  const reset = useCallback(() => {
    run.current++;
    setAttempt({ key: null, flow: { phase: "idle" } });
  }, []);

  // Looks up a pending subscription's own transaction once. Asking only "is the plan active" cannot tell a
  // transaction that failed from one that has not landed yet.
  const checkPending = useCallback(async (): Promise<PendingCheck> => {
    const pending = attempt.flow;
    if (pending.phase !== "unconfirmed" || attempt.key !== key) {
      return "unknown";
    }
    const thisRun = run.current;
    try {
      const { status, returnValue } = await read(
        window.Pi.SmartContract.pollTransaction(pending.hash, 2),
        "the transaction"
      );
      if (thisRun !== run.current) {
        return "unknown";
      }
      if (status === "NOT_FOUND" && Date.now() < pending.expiresAt) {
        return "notYet";
      }
      const { plan, autoRenew, hash } = pending;
      onSettled();
      if (status === "SUCCESS") {
        setAttempt({ key, flow: landed({ plan, autoRenew }, returnValue && scValToNative(returnValue)) });
        return "landed";
      }
      // FAILED, or still not found after its lifetime: it can no longer land
      const expired = status === "NOT_FOUND";
      const details = `Transaction ${hash}: ${expired ? "expired" : status}`;
      setAttempt({ key, flow: { phase: "failed", plan, autoRenew, expired, details } });
      return "failed";
    } catch (err) {
      console.error("Error checking the pending subscription:", err);
      return "unknown";
    }
  }, [attempt, key, onSettled]);

  const flow: SubscribeFlow = key && attempt.key === key ? attempt.flow : { phase: "idle" };
  return { flow, subscribe, reset, checkPending };
};
