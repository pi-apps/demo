import type { ContractSubscription, SubscriptionService } from "../../types/pi";

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
// behind Details.
export type Failure = { status: "error"; error: string; retry: boolean; details?: string };
export type Loadable<T> = { status: "loading" } | Failure | { status: "ready"; value: T };

// whether the subscription read lists this plan as one the wallet actively has
export const hasActivePlan = (status: Loadable<MySubscription | null>, serviceId: string) =>
  status.status === "ready" && !!status.value?.activeServiceIds.includes(serviceId);

export const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));
export const failure = (error: string, retry: boolean, err?: unknown): Failure => ({
  status: "error",
  error,
  retry,
  details: err === undefined ? undefined : errorText(err),
});

export const toPlan = (service: SubscriptionService): Plan => ({
  serviceId: String(service.service_id),
  name: service.name,
  price: BigInt(service.price),
  periodSecs: Number(service.period_secs),
  trialSecs: Number(service.trial_period_secs),
  isActive: service.is_active,
});

// trial plans first, then shortest period first
export const byTrialThenPeriod = (a: Plan, b: Plan) =>
  Number(b.trialSecs > 0) - Number(a.trialSecs > 0) || a.periodSecs - b.periodSecs;

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
