import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import {
  hasActivePlan,
  isRenewalDue,
  planFor,
  type Loadable,
  type MySubscription,
  type Plan,
} from "../../hooks/club/plans";
import { type SubscribeFlow, isBusy } from "../../hooks/club/useSubscribeAttempt";
import { describePeriod, shortAddress } from "../../utils/subscription";
import { Column, Row } from "../lib";
import { planCopy, price } from "./copy";
import { FeeRow, Summary } from "./PlanSheet.styles";

interface PlanChoiceProps {
  plans: Plan[];
  initialServiceId: string;
  // the trial switch to start from: on, unless "Try again" brings back an attempt that had it off
  initialKeepAfterTrial: boolean;
  // idle, or an attempt in progress (signing or confirming)
  flow: SubscribeFlow;
  // the wallet's subscriptions as last read; subscribing waits until they are known
  status: Loadable<MySubscription | null>;
  walletAddress: string | null;
  onSubscribe: (plan: Plan, autoRenew: boolean) => void;
}

// Why the wallet cannot start this plan: the contract refuses a plan the wallet still has (AlreadySubscribed).
// Other plans stay open, so the user can change plan.
const blockedReason = (status: Loadable<MySubscription | null>, serviceId: string) => {
  if (hasActivePlan(status, serviceId)) return "You already have this plan. Pick another one, or close this to see it.";
  if (isRenewalDue(status, serviceId)) {
    return "This plan ran out with auto-renew on, so it can't be started again until Pi Bakery charges the renewal.";
  }
  return null;
};

// the line under the button: progress while subscribing, else why subscribing is blocked, else what is signed
const footerText = (props: {
  flow: SubscribeFlow;
  fine: string;
  status: Loadable<MySubscription | null>;
  blocked: string | null;
  walletAddress: string | null;
}) => {
  const { flow, fine, status, blocked, walletAddress } = props;
  if (flow.phase === "confirming") return "Usually a few seconds.";
  if (flow.phase === "signing") return fine;
  if (status.status === "loading") return "Checking your wallet's subscriptions…";
  if (status.status === "error") return status.error;
  if (blocked) return blocked;
  // the subscriptions are read from the wallet, so this is only a guard
  if (walletAddress === null) return fine;
  return `${fine} From your wallet ${shortAddress(walletAddress)}, confirmed in your Pi Wallet.`;
};

// the segmented control fits four plans; a wallet with more lists them one under another
const MAX_SIDE_BY_SIDE = 4;

const buttonLabel = (flow: SubscribeFlow, cta: string) => {
  switch (flow.phase) {
    case "signing":
      return "Confirm in your Pi Wallet…";
    case "confirming":
      return `Confirming on Pi Testnet… ${flow.seconds}s`;
    default:
      return cta;
  }
};

// picking a plan in the sheet; mounted afresh each time the sheet opens
const PlanChoice = (props: PlanChoiceProps) => {
  const { plans, initialServiceId, initialKeepAfterTrial, flow, status, walletAddress, onSubscribe } = props;
  // reopened during an attempt, the sheet starts from that attempt's choices, not the defaults
  const [serviceId, setServiceId] = useState(flow.phase === "idle" ? initialServiceId : flow.plan.serviceId);
  const [keepAfterTrial, setKeepAfterTrial] = useState(flow.phase === "idle" ? initialKeepAfterTrial : flow.autoRenew);

  const busy = isBusy(flow);
  // while subscribing, the sheet shows what is being signed; otherwise the plan as this wallet would get it
  const plan = busy ? flow.plan : planFor(status, plans.find(p => p.serviceId === serviceId) ?? plans[0]);
  const keepAfter = busy ? flow.autoRenew : keepAfterTrial;
  const isTrial = plan.trialSecs > 0;
  const copy = planCopy(plan, keepAfter);
  const blocked = blockedReason(status, plan.serviceId);
  const canSubscribe = walletAddress !== null && status.status === "ready" && !blocked;

  return (
    <Column gap={2}>
      <ToggleButtonGroup
        exclusive
        fullWidth
        orientation={plans.length > MAX_SIDE_BY_SIDE ? "vertical" : "horizontal"}
        size="small"
        aria-label="Plan"
        disabled={busy}
        value={plan.serviceId}
        onChange={(_event, value: string | null) => value && setServiceId(value)}
      >
        {plans.map(p => (
          <ToggleButton key={p.serviceId} value={p.serviceId}>
            {p.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Summary>
        <Typography variant="h4" component="p" fontWeight={700}>
          {isTrial ? "Free" : price(plan)}{" "}
          <Typography component="span" color="text.secondary">
            {isTrial ? `for ${describePeriod(plan.trialSecs).span}` : describePeriod(plan.periodSecs).per}
          </Typography>
        </Typography>
        <Typography color="text.secondary">{copy.lead}</Typography>
        {isTrial && (
          <Row gap={1.5} mt={2}>
            <Box flex={1}>
              <Typography fontWeight={600}>Continue after the trial</Typography>
              <Typography id="club-trial-switch-description" variant="body2" color="text.secondary">
                {copy.switchHint}
              </Typography>
            </Box>
            <Switch
              checked={keepAfter}
              disabled={busy}
              onChange={() => setKeepAfterTrial(keep => !keep)}
              slotProps={{
                input: {
                  role: "switch",
                  "aria-label": "Continue after the trial",
                  "aria-describedby": "club-trial-switch-description",
                },
              }}
            />
          </Row>
        )}
        <FeeRow>
          <span>Due today</span>
          <b>{isTrial ? "0 Test-Pi" : price(plan)}</b>
        </FeeRow>
        <FeeRow>
          <span>Network fee</span>
          <b>Shown in your Pi Wallet</b>
        </FeeRow>
      </Summary>

      <Button
        variant="contained"
        size="large"
        disabled={busy || !canSubscribe}
        aria-busy={busy}
        startIcon={busy && <CircularProgress size={16} color="inherit" aria-hidden="true" />}
        onClick={() => onSubscribe(plan, keepAfter || !isTrial)}
      >
        {buttonLabel(flow, copy.cta)}
      </Button>
      <Typography role="status" variant="body2" color="text.secondary" align="center">
        {footerText({ flow, fine: copy.fine, status, blocked, walletAddress })}
      </Typography>
    </Column>
  );
};

export default PlanChoice;
