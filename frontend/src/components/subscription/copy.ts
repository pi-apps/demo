import { periodsFor, type MySubscription, type Plan } from "../../hooks/club/plans";
import { describePeriod, formatDate, formatPi, fromChainTime } from "../../utils/subscription";

// Dates before signing (and on the success screen right after it) are estimates from the phone's clock. The
// contract sets the real ones on subscribe; the card and the club page show those.
export const fromNow = (seconds: number) => formatDate(new Date(Date.now() + seconds * 1000));

// Nothing charges on a timer: each renewal is charged when the app runs billing (Process, in Developer tools)
export const BILLING_NOTE = "Pi Bakery charges each renewal when it runs billing.";

// auto renew pre-approves a limited number of charges (see periodsFor), so the copy says how many
export const upTo = (count: number) => `up to ${count} ${count === 1 ? "charge" : "charges"}`;

export const price = (plan: Plan) => `${formatPi(plan.price)} Test-Pi`;

// the plan sheet's words for a plan
export const planCopy = (plan: Plan, keepAfterTrial: boolean) => {
  const period = describePeriod(plan.periodSecs);
  const charges = upTo(periodsFor(plan, true));
  if (plan.trialSecs === 0) {
    return {
      cta: `Subscribe for ${price(plan)}${period.per}`,
      lead: `Billed ${period.every}, ${charges} after today. Next charge due ${fromNow(plan.periodSecs)}.`,
      fine: BILLING_NOTE,
    };
  }
  const trialEnd = fromNow(plan.trialSecs);
  return {
    cta: "Start free trial",
    lead: keepAfterTrial
      ? `Free for ${describePeriod(plan.trialSecs).span}, then ${price(plan)}${period.per}.`
      : `Free for ${describePeriod(plan.trialSecs).span}. Doesn't renew.`,
    fine: keepAfterTrial
      ? `Free until ${trialEnd}. Then ${price(plan)} ${period.every}, ${charges}. ${BILLING_NOTE}`
      : `Free until ${trialEnd}. The trial doesn't renew.`,
    switchHint: keepAfterTrial
      ? `${price(plan)}${period.per} from ${trialEnd}, ${charges}.`
      : `The trial ends ${trialEnd} and doesn't renew.`,
  };
};

// one line about a subscription on the card, from the contract's own dates
export const subscriptionLine = (mine: MySubscription) => {
  const { subscription: s } = mine;
  const amount = `${formatPi(BigInt(s.price))} Test-Pi`;
  const period = describePeriod(Number(s.period_secs));
  const date = (timestamp: string) => formatDate(fromChainTime(timestamp));
  if (mine.inTrial) {
    return s.auto_renew
      ? `Free until ${date(s.trial_end_ts)}, then ${amount}${period.per}`
      : `Free until ${date(s.trial_end_ts)}, then ends`;
  }
  return s.auto_renew ? `Next charge due ${date(s.next_charge_ts)} · ${amount}` : `Ends ${date(s.service_end_ts)}`;
};
