import { periodsFor, type Loadable, type MySubscription, type Plan } from "../../hooks/club/plans";
import type { PendingCheck, SubscribeFlow } from "../../hooks/club/useSubscribeAttempt";
import { describePeriod } from "../../utils/subscription";
import type { InfoRow } from "./InfoRows";
import { BILLING_NOTE, fromNow, price, upTo } from "./copy";

// the words on the sheet's outcome screens

export type Outcome = Exclude<SubscribeFlow, { phase: "idle" | "signing" | "confirming" }>;
// what the sheet tells the user: "uncertain" is an error that may or may not have gone through
export type OutcomeKind = "success" | "already" | "pending" | "failed" | "uncertain";

// An uncertain or pending attempt whose plan the contract now lists as active has landed after all.
export const outcomeKind = (flow: Outcome, planActive: boolean): OutcomeKind => {
  switch (flow.phase) {
    case "success":
      return "success";
    case "already":
      return "already";
    case "failed":
      return "failed";
    case "error":
      return planActive ? "success" : "uncertain";
    case "unconfirmed":
      return planActive ? "success" : "pending";
  }
};

const successBody = (plan: Plan, autoRenew: boolean) => {
  const period = describePeriod(plan.periodSecs);
  if (plan.trialSecs === 0) {
    return `It renews ${period.every}, ${upTo(periodsFor(plan, true))} after today. ${BILLING_NOTE}`;
  }
  if (!autoRenew) {
    return "Enjoy. It doesn't renew.";
  }
  return `It becomes ${price(plan)}${period.per} from ${fromNow(plan.trialSecs)}. ${BILLING_NOTE}`;
};

const failedBody = (flow: Outcome) =>
  flow.phase === "failed" && flow.expired
    ? "The transaction expired before it reached Pi Testnet, so nothing was charged. Your plan choice is kept."
    : "Pi Testnet rejected the transaction. Your plan choice is kept.";

export const outcomeText = (kind: OutcomeKind, flow: Outcome) => {
  const { plan } = flow;
  switch (kind) {
    case "success":
      return {
        title: plan.trialSecs > 0 ? "Your free trial has started" : "You're subscribed",
        body: successBody(plan, flow.autoRenew),
      };
    case "already":
      return {
        title: "You already have this plan",
        body: `Your wallet is already subscribed to ${plan.name}, so this attempt didn't change anything.`,
      };
    case "pending":
      return {
        title: "Still waiting for Pi Testnet",
        body: "Your subscription hasn't landed yet. It may still go through: check again in a minute. After about three minutes the check can tell for sure.",
      };
    case "failed":
      return { title: "Subscription didn't go through", body: failedBody(flow) };
    case "uncertain":
      return {
        title: "Couldn't start the subscription",
        body: "Something went wrong and the subscription wasn't confirmed. It may still have gone through, so check before trying again.",
      };
  }
};

// the success screen's summary; the dates are estimates from the phone's clock (see fromNow)
export const summaryRows = (plan: Plan, autoRenew: boolean): InfoRow[] => {
  if (plan.trialSecs === 0) {
    return [
      ["Plan", plan.name],
      ["Charged today", price(plan)],
      ["Next charge due", fromNow(plan.periodSecs)],
    ];
  }
  const period = describePeriod(plan.periodSecs);
  const freeUntil: InfoRow = ["Free until", fromNow(plan.trialSecs)];
  if (!autoRenew) {
    return [["Plan", `${plan.name}, trial only`], freeUntil, ["After that", "Ends"]];
  }
  return [["Plan", `${plan.name}, then ${period.every}`], freeUntil, ["After that", `${price(plan)}${period.per}`]];
};

const NOT_YET = "Not there yet. It can take a little longer, so check again in a minute.";

// what a check of a pending transaction found, when it did not settle the outcome
export const pendingNote = (found: PendingCheck) => {
  switch (found) {
    case "notYet":
      return NOT_YET;
    case "unknown":
      return "Couldn't check right now. Try again in a minute.";
    default:
      return null;
  }
};

// what a re-read of the subscription found, shown from its own state so a failed re-read shows its error
export const rereadNote = (status: Loadable<MySubscription | null>) => {
  switch (status.status) {
    case "loading":
      return "Checking…";
    case "error":
      return status.error;
    case "ready":
      return NOT_YET;
  }
};
