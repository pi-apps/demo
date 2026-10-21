import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import type { Loadable, MySubscription, Plan } from "../../hooks/club/plans";
import type { PendingCheck, SubscribeFlow } from "../../hooks/club/useSubscribeAttempt";
import { describePeriod, formatPi, shortAddress } from "../../utils/subscription";
import { Column, Row } from "../lib";
import { planCopy, price } from "./copy";
import { FeeRow, SheetPaper, Summary } from "./PlanSheet.styles";
import SubscribeResult from "./SubscribeResult";

interface PlanSheetProps {
  plans: Plan[];
  initialServiceId: string;
  flow: SubscribeFlow;
  // the wallet's subscriptions as last read; subscribing waits until they are known
  status: Loadable<MySubscription | null>;
  // the signed-in user's wallet, from the SDK
  walletAddress: string | null;
  onSubscribe: (plan: Plan, autoRenew: boolean) => void;
  onResetFlow: () => void;
  onClose: () => void;
  onOpenClub: () => void;
  onCheckAgain: () => void;
  onCheckPending: () => Promise<PendingCheck>;
}

const PlanSheet = (props: PlanSheetProps) => {
  const { plans, flow, status, walletAddress, onSubscribe, onResetFlow, onClose } = props;
  // reopened during or after an attempt, the sheet starts from that attempt's choices, not the defaults
  const [serviceId, setServiceId] = useState(flow.phase === "idle" ? props.initialServiceId : flow.plan.serviceId);
  const [keepAfterTrial, setKeepAfterTrial] = useState(flow.phase === "idle" ? true : flow.autoRenew);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const busy = flow.phase === "signing" || flow.phase === "confirming";
  // while subscribing, the sheet shows what is being signed
  const plan = busy ? flow.plan : (plans.find(p => p.serviceId === serviceId) ?? plans[0]);
  const keepAfter = busy ? flow.autoRenew : keepAfterTrial;
  const isTrial = plan.trialSecs > 0;
  const copy = planCopy(plan, keepAfter);
  // Only a plan the wallet already has is blocked (the contract has an AlreadySubscribed error for it); other
  // plans stay open, as in the prototype's "Change plan".
  const alreadySubscribed = status.status === "ready" && !!status.value?.activeServiceIds.includes(plan.serviceId);
  const canSubscribe = walletAddress !== null && status.status === "ready" && !alreadySubscribed;
  const showingResult = flow.phase !== "idle" && !busy;

  // a pending subscription is kept on close, so the card can say so and nothing new is started over it
  const close = () => {
    if (!busy && flow.phase !== "unconfirmed") {
      onResetFlow();
    }
    onClose();
  };

  const footer =
    flow.phase === "confirming"
      ? "Usually a few seconds."
      : busy
        ? copy.fine
        : status.status === "loading"
          ? "Checking your wallet's subscriptions…"
          : status.status === "error"
            ? status.error
            : alreadySubscribed
              ? "You already have this plan. Pick another one, or close this to see it."
              : `${copy.fine} From your wallet ${walletAddress ? shortAddress(walletAddress) : ""}, confirmed in your Pi Wallet.`;

  return (
    <Drawer
      anchor="bottom"
      open
      onClose={close}
      transitionDuration={reduceMotion ? 0 : undefined}
      slotProps={{
        paper: {
          component: SheetPaper,
          role: "dialog",
          "aria-modal": true,
          "aria-label": showingResult ? "Subscription result" : "Choose your plan",
        },
      }}
    >
      <Row justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          {showingResult ? "Pi Bakery Club" : "Choose your plan"}
        </Typography>
        <IconButton onClick={close} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Row>

      {showingResult ? (
        <SubscribeResult
          flow={flow}
          status={status}
          onTryAgain={onResetFlow}
          onDone={close}
          onOpenClub={props.onOpenClub}
          onCheckAgain={props.onCheckAgain}
          onCheckPending={props.onCheckPending}
        />
      ) : (
        <Column gap={2}>
          <ToggleButtonGroup
            exclusive
            fullWidth
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
            <Typography variant="h4" fontWeight={700}>
              {isTrial ? "Free" : `${formatPi(plan.price)} Test-Pi`}{" "}
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
            startIcon={busy && <CircularProgress size={16} color="inherit" />}
            onClick={() => onSubscribe(plan, keepAfter || !isTrial)}
          >
            {flow.phase === "signing"
              ? "Confirm in your Pi Wallet…"
              : flow.phase === "confirming"
                ? `Confirming on Pi Testnet… ${flow.seconds}s`
                : copy.cta}
          </Button>
          <Typography role="status" variant="body2" color="text.secondary" align="center">
            {footer}
          </Typography>
        </Column>
      )}
    </Drawer>
  );
};

export default PlanSheet;
