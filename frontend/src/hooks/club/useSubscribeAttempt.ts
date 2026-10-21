import { useCallback, useRef, useState } from "react";
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
  // the contract refused because the wallet already has this plan (AlreadySubscribed), e.g. an earlier attempt
  // that landed late: the user is subscribed, though not by this attempt
  | ({ phase: "already" } & Choice)
  // the transaction landed and the network rejected it, or it never landed and its lifetime ran out (expired)
  | ({ phase: "failed"; details: string; expired?: boolean } & Choice)
  // the SDK threw: in the wallet, on submit or while polling, so the transaction may or may not have been sent
  | ({ phase: "error"; details: string } & Choice)
  // Not landed within the wait: it may still go through, so it is not reported as failed. It stays pending, with
  // its transaction, until a check finds it landed, failed or expired, so nothing new is started over it.
  | ({ phase: "unconfirmed"; hash: string; expiresAt: number } & Choice);

export type PendingCheck = "landed" | "failed" | "notYet" | "unknown";

// The SDK builds every transaction to expire 180 seconds after it is built (contractContext.ts,
// TRANSACTION_TIMEOUT_IN_SEC), and building happens before signing, so 180 seconds after submitting is a safe
// upper bound: one still not found after that can no longer land.
const TRANSACTION_LIFETIME_MS = 180_000;

// key: the session and wallet the attempt belongs to (null when there is no wallet); onSettled: re-read the
// subscription, since the contract is the record of whether the user is now subscribed
export const useSubscribeAttempt = (walletAddress: string | null, key: string | null, onSettled: () => void) => {
  const [attempt, setAttempt] = useState<{ key: string | null; flow: SubscribeFlow }>({
    key: null,
    flow: { phase: "idle" },
  });
  // the latest run: one overtaken by a newer run (or a new session) must stop writing
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
        const expiresAt = Date.now() + TRANSACTION_LIFETIME_MS;
        setFlow({ phase: "confirming", plan, autoRenew, seconds: 0 });
        const tx = await waitForTransaction(submitted.hash, seconds =>
          setFlow({ phase: "confirming", plan, autoRenew, seconds })
        );
        if (tx.status === "SUCCESS") {
          setFlow({ phase: "success", plan, autoRenew });
        } else if (tx.status === "FAILED") {
          setFlow({ phase: "failed", plan, autoRenew, details: toJSON(tx) });
        } else {
          setFlow({ phase: "unconfirmed", plan, autoRenew, hash: submitted.hash, expiresAt });
        }
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
      const { status } = await read(window.Pi.SmartContract.pollTransaction(pending.hash, 2), "the transaction");
      if (thisRun !== run.current) {
        return "unknown";
      }
      if (status === "NOT_FOUND" && Date.now() < pending.expiresAt) {
        return "notYet";
      }
      const { plan, autoRenew, hash } = pending;
      const expired = status === "NOT_FOUND";
      setAttempt({
        key,
        flow:
          status === "SUCCESS"
            ? { phase: "success", plan, autoRenew }
            : {
                phase: "failed",
                plan,
                autoRenew,
                expired,
                details: `Transaction ${hash}: ${expired ? "expired" : status}`,
              },
      });
      onSettled();
      return status === "SUCCESS" ? "landed" : "failed";
    } catch (err) {
      console.error("Error checking the pending subscription:", err);
      return "unknown";
    }
  }, [attempt, key, onSettled]);

  const flow: SubscribeFlow = key && attempt.key === key ? attempt.flow : { phase: "idle" };
  return { flow, subscribe, reset, checkPending };
};
