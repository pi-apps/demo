import { StrKey } from "@stellar/stellar-base";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ContractSubscription, SubscriptionService } from "../types/pi";
import { toJSON } from "../utils/toJSON";
import { withTimeout } from "../utils/withTimeout";
import { onIncompletePaymentFound, rememberWalletGrant, SIGN_IN_SCOPES, WALLET_SCOPE } from "./useAuth";
import { APP_WALLET_ADDRESS, waitForTransaction } from "./useSubscriptions";

// Pi Bakery Club: the app's subscription services, read from the subscription contract. Price, period and trial
// live on-chain in each service; the app picks which service to subscribe to and how many periods to approve.

export type Plan = {
  serviceId: string;
  name: string;
  price: bigint;
  periodSecs: number;
  trialSecs: number;
  isActive: boolean;
};

export type MySubscription = {
  plan: Plan;
  subscription: ContractSubscription;
  // from the contract's is_subscription_active, not worked out from the timestamps here
  active: boolean;
  // every one of the app's plans this wallet is actively subscribed to, not only the one shown
  activeServiceIds: string[];
  // against the phone's clock when the subscription was read
  inTrial: boolean;
  hasEnded: boolean;
};

// A failure the screens can show as it is: a plain sentence, whether trying again can help, and the raw error
// behind "Show details".
export type Failure = { status: "error"; error: string; retry: boolean; details?: string };
type Loadable<T> = { status: "loading" } | Failure | { status: "ready"; value: T };
// a finished read, with which read it was and which session (and wallet) it was for
type Loaded<T> = Exclude<Loadable<T>, { status: "loading" }> & { read: number; key: string };

export type SubscribeFlow =
  | { phase: "idle" }
  | { phase: "signing"; plan: Plan; autoRenew: boolean }
  | { phase: "confirming"; plan: Plan; autoRenew: boolean; seconds: number }
  | { phase: "success"; plan: Plan; autoRenew: boolean }
  // the contract refused because the wallet already has this plan (AlreadySubscribed), e.g. an earlier attempt
  // that landed late: the user is subscribed, though not by this attempt
  | { phase: "already"; plan: Plan; autoRenew: boolean }
  // the transaction landed and the network rejected it
  // (or it never landed and its lifetime ran out: expired)
  | { phase: "failed"; plan: Plan; autoRenew: boolean; details: string; expired?: boolean }
  // the SDK threw: in the wallet, on submit or while polling, so the transaction may or may not have been sent
  | { phase: "error"; plan: Plan; autoRenew: boolean; details: string }
  // Not landed within the wait: it may still go through, so it is not reported as failed. It stays pending, with
  // its transaction, until a check finds it landed or failed, so a second subscription is not started over it.
  | { phase: "unconfirmed"; plan: Plan; autoRenew: boolean; hash: string; expiresAt: number };

// The SDK builds every transaction to expire 180 seconds after it is built (contractContext.ts,
// TRANSACTION_TIMEOUT_IN_SEC), and building happens before signing, so 180 seconds after submitting is a safe
// upper bound: one still not found after that can no longer land.
const TRANSACTION_LIFETIME_MS = 180_000;

const READ_TIMEOUT_MS = 20_000;
const read = <T>(promise: Promise<T>, what: string) => withTimeout(promise, READ_TIMEOUT_MS, `reading ${what}`);

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

// The signed-in user's wallet. The wallet_address scope is asked for only here, for users who get the club, rather
// than at every sign-in: authenticating again with it shows the consent screen for just that scope. The platform
// lists the active wallet first (pi back, users_controller#user_wallets orders by is_active, then updated_at).
// The consent screen waits on the user, so it gets a long timeout rather than none: a host that never answers
// must still end in something the user can retry.
const CONSENT_TIMEOUT_MS = 120_000;
const loadWallet = async () => {
  await withTimeout(
    window.Pi.authenticate([...SIGN_IN_SCOPES, WALLET_SCOPE], onIncompletePaymentFound),
    CONSENT_TIMEOUT_MS,
    "waiting for the wallet address permission"
  );
  rememberWalletGrant();
  const { wallets } = await read(window.Pi.Wallet.getUserWalletAddresses(), "your wallet address");
  const address = wallets?.[0]?.publicKey;
  // it arrives over the SDK bridge, so it is checked before it is used as an address
  if (typeof address !== "string" || !StrKey.isValidEd25519PublicKey(address)) {
    throw new Error("No wallet found for this user");
  }
  return address;
};

const walletFailure = (err: unknown): Failure => {
  const details = errorText(err);
  if (details.startsWith("Unauthorized app.")) {
    return { status: "error", error: "This app isn't allowed to read wallet addresses yet.", retry: false, details };
  }
  if (details.startsWith("Missing wallet_address scope.") || details.startsWith("User consent cancelled")) {
    return {
      status: "error",
      error: "Pi Bakery Club needs permission to read your wallet address.",
      retry: true,
      details,
    };
  }
  if (details === "No wallet found for this user") {
    // the platform lists only wallets with Pi Testnet enabled
    return {
      status: "error",
      error: "No Pi wallet with Pi Testnet enabled was found for your account.",
      retry: false,
      details,
    };
  }
  return { status: "error", error: "Couldn't read your wallet address.", retry: true, details };
};

const toPlan = (service: SubscriptionService): Plan => ({
  serviceId: String(service.service_id),
  name: service.name,
  price: BigInt(service.price),
  periodSecs: Number(service.period_secs),
  trialSecs: Number(service.trial_period_secs),
  isActive: service.is_active,
});

// trial plans first, then shortest period first
const byTrialThenPeriod = (a: Plan, b: Plan) =>
  Number(b.trialSecs > 0) - Number(a.trialSecs > 0) || a.periodSecs - b.periodSecs;

const loadPlans = async () => {
  const services = await read(
    window.Pi.SmartContract.Subscription.getMerchantServices(APP_WALLET_ADDRESS),
    "the plans"
  );
  return services.map(toPlan).sort(byTrialThenPeriod);
};

// the user's most relevant subscription to one of the app's plans: the newest active one, else the newest
const loadMySubscription = async (walletAddress: string, plans: Plan[]): Promise<MySubscription | null> => {
  const plansById = new Map(plans.map(plan => [plan.serviceId, plan]));
  const all = await read(
    window.Pi.SmartContract.Subscription.getSubscriberSubscriptions(walletAddress),
    "your subscriptions"
  );
  const ours = all
    .filter(subscription => plansById.has(String(subscription.service_id)))
    .sort((a, b) => Number(b.created_at) - Number(a.created_at));
  if (ours.length === 0) {
    return null;
  }

  const serviceIds = [...new Set(ours.map(subscription => String(subscription.service_id)))];
  const activeServiceIds = (
    await Promise.all(
      serviceIds.map(async serviceId =>
        (await read(
          window.Pi.SmartContract.Subscription.isSubscriptionActive(walletAddress, serviceId),
          "whether your subscription is active"
        ))
          ? serviceId
          : null
      )
    )
  ).filter((serviceId): serviceId is string => serviceId !== null);

  const pick = ours.find(subscription => activeServiceIds.includes(String(subscription.service_id))) ?? ours[0];
  const now = Date.now() / 1000;
  return {
    plan: plansById.get(String(pick.service_id))!,
    subscription: pick,
    active: activeServiceIds.includes(String(pick.service_id)),
    activeServiceIds,
    inTrial: Number(pick.trial_end_ts) > now,
    hasEnded: Number(pick.service_end_ts) <= now,
  };
};

const subscriptionFailure = (err: unknown): Failure => {
  const details = errorText(err);
  // the SDK loads the subscriber's account before every read, and a wallet never used on Pi Testnet has none
  if (/Account not found/i.test(details)) {
    return {
      status: "error",
      error: "Your wallet isn't on Pi Testnet yet. Open it once in the Pi Wallet to activate it, then try again.",
      retry: true,
      details,
    };
  }
  return { status: "error", error: "Couldn't check your subscription.", retry: true, details };
};

// How many billing periods a subscription pre-approves. Taken from the prototype (v2.3, 19 Oct 2026): as many as
// fit in 180 days, the network's max_entry_ttl on Pi Testnet at the time, and at least one; 1 without auto renew.
// The services' own approve_periods value is not used; whether it should be is an open question for the contract's
// owners, and so is refreshing the 180 days if the network's limit changes.
const APPROVAL_WINDOW_SECS = 180 * 86400;
export const periodsFor = (plan: Plan, autoRenew: boolean) =>
  autoRenew ? Math.max(1, Math.floor((APPROVAL_WINDOW_SECS - plan.trialSecs) / plan.periodSecs)) : 1;

// the plan a new subscription starts on: the first paid plan, else the first one
export const defaultPlan = (plans: Plan[]): Plan | undefined => plans.find(plan => plan.trialSecs === 0) ?? plans[0];

// after a plan ends, resubscribing starts on the same plan, or on the first paid plan after a trial
export const planToResubscribe = (plans: Plan[], ended: MySubscription): Plan | undefined =>
  plans.find(plan => plan.serviceId === ended.plan.serviceId && plan.trialSecs === 0) ?? defaultPlan(plans);

// enabled: whether this user gets the club at all (see isSubscriptionEnabledFor); nothing is read otherwise.
// walletWanted: whether the current page needs the wallet, so the permission is only asked where it is used.
export const useClubSubscription = (enabled: boolean, sessionId: number, walletWanted: boolean) => {
  const [walletRead, setWalletRead] = useState(0);
  const [wallet, setWallet] = useState<Loaded<string> | null>(null);
  const [plansRead, setPlansRead] = useState(0);
  const [plans, setPlans] = useState<Loaded<Plan[]> | null>(null);
  const [mineRead, setMineRead] = useState(0);
  const [mine, setMine] = useState<Loaded<MySubscription | null> | null>(null);
  // an attempt belongs to the session and wallet it was made for
  const [attempt, setAttempt] = useState<{ key: string | null; flow: SubscribeFlow }>({
    key: null,
    flow: { phase: "idle" },
  });
  // React runs effects twice in development; one wallet request per session and read, so one consent screen
  const walletRequest = useRef<{ key: string; promise: Promise<string> } | null>(null);
  // the latest subscribe run: one overtaken by a newer run (or a new session) must stop writing
  const subscribeRun = useRef(0);

  // Each result is stored with the read (and session) it answers. Until the newest one lands the screens show
  // loading, so neither a retried read nor a previous session's answer is ever shown as the current one.
  const walletKey = `${sessionId}:${walletRead}`;
  useEffect(() => {
    if (!enabled || !walletWanted) {
      return;
    }
    if (walletRequest.current?.key !== walletKey) {
      walletRequest.current = { key: walletKey, promise: loadWallet() };
    }
    let current = true;
    walletRequest.current.promise.then(
      value => current && setWallet({ read: walletRead, key: String(sessionId), status: "ready", value }),
      err => {
        console.error("Error reading the user's wallet address:", err);
        if (current) setWallet({ read: walletRead, key: String(sessionId), ...walletFailure(err) });
      }
    );
    return () => {
      current = false;
    };
  }, [enabled, walletWanted, sessionId, walletRead, walletKey]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let current = true;
    loadPlans().then(
      value => current && setPlans({ read: plansRead, key: "", status: "ready", value }),
      err => {
        console.error("Error reading the app's plans:", err);
        const details = errorText(err);
        if (current)
          setPlans({
            read: plansRead,
            key: "",
            status: "error",
            error: "Couldn't load the plans.",
            retry: true,
            details,
          });
      }
    );
    return () => {
      current = false;
    };
  }, [enabled, plansRead]);

  const currentWallet = wallet?.read === walletRead && wallet.key === String(sessionId) ? wallet : null;
  const walletAddress = enabled && currentWallet?.status === "ready" ? currentWallet.value : null;
  const readyPlans = plans?.read === plansRead && plans.status === "ready" ? plans.value : null;
  // what the subscription read and the attempt are tied to: this session and this wallet
  const mineKey = walletAddress ? `${sessionId}:${walletAddress}` : null;

  useEffect(() => {
    if (!walletAddress || !readyPlans || !mineKey) {
      return;
    }
    let current = true;
    loadMySubscription(walletAddress, readyPlans).then(
      value => current && setMine({ read: mineRead, key: mineKey, status: "ready", value }),
      err => {
        console.error("Error reading the user's subscription:", err);
        if (current) setMine({ read: mineRead, key: mineKey, ...subscriptionFailure(err) });
      }
    );
    return () => {
      current = false;
    };
  }, [walletAddress, readyPlans, mineRead, mineKey]);

  const refresh = useCallback(() => setMineRead(n => n + 1), []);

  const subscribe = useCallback(
    async (plan: Plan, autoRenew: boolean) => {
      if (!walletAddress || !mineKey) {
        return;
      }
      const run = ++subscribeRun.current;
      const isCurrent = () => run === subscribeRun.current;
      const setFlow = (flow: SubscribeFlow) => isCurrent() && setAttempt({ key: mineKey, flow });
      setFlow({ phase: "signing", plan, autoRenew });
      try {
        const submitted = await window.Pi.SmartContract.Subscription.subscribe(
          walletAddress,
          plan.serviceId,
          autoRenew,
          String(periodsFor(plan, autoRenew))
        );

        const submittedAt = Date.now();
        setFlow({ phase: "confirming", plan, autoRenew, seconds: 0 });
        const transaction = await waitForTransaction(submitted.hash, seconds =>
          setFlow({ phase: "confirming", plan, autoRenew, seconds })
        );
        if (transaction.status === "SUCCESS") {
          setFlow({ phase: "success", plan, autoRenew });
        } else if (transaction.status === "FAILED") {
          setFlow({ phase: "failed", plan, autoRenew, details: toJSON(transaction) });
        } else {
          setFlow({
            phase: "unconfirmed",
            plan,
            autoRenew,
            hash: submitted.hash,
            expiresAt: submittedAt + TRANSACTION_LIFETIME_MS,
          });
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
      // whatever happened, the contract is the record of whether the user is now subscribed
      if (isCurrent()) {
        refresh();
      }
    },
    [walletAddress, mineKey, refresh]
  );

  const resetFlow = useCallback(() => {
    subscribeRun.current++;
    setAttempt({ key: null, flow: { phase: "idle" } });
  }, []);

  // Looks up a pending subscription's own transaction once: landed, failed, or still not there. Asking only
  // "is the plan active" cannot tell a transaction that failed from one that has not landed yet.
  const checkPending = useCallback(async (): Promise<"landed" | "failed" | "notYet" | "unknown"> => {
    const pending = attempt.flow;
    if (pending.phase !== "unconfirmed" || attempt.key !== mineKey) {
      return "unknown";
    }
    const run = subscribeRun.current;
    try {
      const { status } = await read(window.Pi.SmartContract.pollTransaction(pending.hash, 2), "the transaction");
      if (run !== subscribeRun.current) {
        return "unknown";
      }
      if (status === "NOT_FOUND" && Date.now() < pending.expiresAt) {
        return "notYet";
      }
      const { plan, autoRenew } = pending;
      setAttempt({
        key: mineKey,
        flow:
          status === "SUCCESS"
            ? { phase: "success", plan, autoRenew }
            : {
                phase: "failed",
                plan,
                autoRenew,
                expired: status === "NOT_FOUND",
                details:
                  status === "NOT_FOUND"
                    ? `Transaction ${pending.hash} expired without landing`
                    : `Transaction ${pending.hash}: ${status}`,
              },
      });
      refresh();
      return status === "SUCCESS" ? "landed" : "failed";
    } catch (err) {
      console.error("Error checking the pending subscription:", err);
      return "unknown";
    }
  }, [attempt, mineKey, refresh]);

  const flow: SubscribeFlow = mineKey && attempt.key === mineKey ? attempt.flow : { phase: "idle" };
  const plansFailed = plans?.read === plansRead && plans.status === "error" ? plans : null;
  const walletFailed = currentWallet?.status === "error" ? currentWallet : null;
  const currentMine = mine?.read === mineRead && mine.key === mineKey ? mine : null;

  // one status for the screens: the first thing that failed or is not ready yet is what they show
  const status: Loadable<MySubscription | null> = walletFailed ?? plansFailed ?? currentMine ?? { status: "loading" };

  const retry = walletFailed ? () => setWalletRead(n => n + 1) : plansFailed ? () => setPlansRead(n => n + 1) : refresh;

  return {
    enabled,
    walletAddress,
    plans: readyPlans?.filter(plan => plan.isActive) ?? [],
    status,
    // tries again whatever failed; only offered when status.retry says it can help
    retry,
    // reads the user's subscription again, e.g. when a transaction may have landed after we stopped waiting
    refresh,
    flow,
    subscribe,
    resetFlow,
    checkPending,
  };
};

// one club state for the whole app, so the shop and the club page share reads and an attempt in progress
export const ClubContext = createContext<ReturnType<typeof useClubSubscription> | null>(null);

export const useClub = () => {
  const club = useContext(ClubContext);
  if (!club) {
    throw new Error("useClub must be used inside ClubProvider");
  }
  return club;
};
