import { periodsFor, type MySubscription, type Plan } from "../../hooks/club/plans";
import { chainDate, describePeriod, formatDate, formatTestPi } from "../../utils/subscription";

// Dates before signing (and on the success screen right after it) are estimates from the phone's clock. The
// contract sets the real ones on subscribe; the card and the club page show those.
export const fromNow = (seconds: number) => formatDate(new Date(Date.now() + seconds * 1000));

// Nothing charges on a timer: each renewal is charged when the app runs billing (Process, in Developer tools)
export const BILLING_NOTE = "Pi Bakery charges each renewal when it runs billing.";

// auto renew pre-approves a limited number of charges (see periodsFor), so the copy says how many
export const upTo = (count: number) => `up to ${count} ${count === 1 ? "charge" : "charges"}`;

export const price = (plan: Plan) => formatTestPi(plan.price);

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
  const trial = describePeriod(plan.trialSecs).span;
  const trialEnd = fromNow(plan.trialSecs);
  if (!keepAfterTrial) {
    return {
      cta: "Start free trial",
      lead: `Free for ${trial}. Doesn't renew.`,
      fine: `Free until ${trialEnd}. The trial doesn't renew.`,
      switchHint: `The trial ends ${trialEnd} and doesn't renew.`,
    };
  }
  return {
    cta: "Start free trial",
    lead: `Free for ${trial}, then ${price(plan)}${period.per}.`,
    fine: `Free until ${trialEnd}. Then ${price(plan)} ${period.every}, ${charges}. ${BILLING_NOTE}`,
    switchHint: `${price(plan)}${period.per} from ${trialEnd}, ${charges}.`,
  };
};

// one line about a subscription on the card, from the contract's own dates
export const subscriptionLine = ({ subscription: s, inTrial }: MySubscription) => {
  const amount = formatTestPi(BigInt(s.price));
  if (inTrial && s.auto_renew) {
    return `Free until ${chainDate(s.trial_end_ts)}, then ${amount}${describePeriod(Number(s.period_secs)).per}`;
  }
  if (inTrial) {
    return `Free until ${chainDate(s.trial_end_ts)}, then ends`;
  }
  if (s.auto_renew) {
    return `Next charge due ${chainDate(s.next_charge_ts)} · ${amount}`;
  }
  return `Ends ${chainDate(s.service_end_ts)}`;
};
