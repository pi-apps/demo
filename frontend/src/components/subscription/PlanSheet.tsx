import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { Plan, SubscribeFlow } from "../../hooks/useClubSubscription";
import { periodsFor } from "../../hooks/useClubSubscription";
import { describePeriod, formatDate, formatPi, shortAddress } from "../../utils/subscription";
import {
  club,
  Cta,
  Detail,
  Fine,
  Ghost,
  ResultBody,
  ResultIcon,
  ResultTitle,
  Rows,
  Scrim,
  Sheet,
  Spinner,
  Stack,
} from "./styles";

// what is known about the typed wallet's subscriptions
export type WalletCheck =
  | { status: "checking" }
  | { status: "failed"; error: string }
  // the plans the wallet is already actively subscribed to
  | { status: "ready"; activeServiceIds: string[] };

interface PlanSheetProps {
  plans: Plan[];
  initialServiceId: string;
  flow: SubscribeFlow;
  onSubscribe: (plan: Plan, autoRenew: boolean) => void;
  onResetFlow: () => void;
  onClose: () => void;
  onOpenClub: () => void;
  // reads the subscription again
  onCheckAgain: () => void;
  // looks up a pending subscription's own transaction
  onCheckPending: () => Promise<"landed" | "failed" | "notYet" | "unknown">;
  // the signed-in user's wallet, from the SDK; subscribing waits for it
  walletAddress: string | null;
  // Subscribing waits until the wallet's subscriptions are known. Only a plan the wallet already has is blocked
  // (the contract has an AlreadySubscribed error for it); other plans stay open, as in the prototype's
  // "Change plan".
  walletCheck: WalletCheck;
}

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }
`;

const Grab = styled.div`
  width: 36px;
  height: 5px;
  border-radius: 3px;
  background: ${club.fillStrong};
  margin: 0 auto 8px;
`;

const CloseButton = styled.button`
  position: relative;

  /* a 44px tap area around the 36px button */
  &::after {
    content: "";
    position: absolute;
    inset: -4px;
  }

  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0;
  background: ${club.fill};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${club.ink};
`;

const Segments = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, 1fr);
  background: ${club.fill};
  border-radius: 12px;
  padding: 3px;
  margin-bottom: 14px;

  button {
    min-height: 40px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: ${club.ink2};
    cursor: pointer;
    padding: 4px;
  }

  button[aria-pressed="true"] {
    background: ${club.surface};
    color: ${club.ink};
    box-shadow: ${club.shadowSoft};
  }
`;

const Summary = styled.div`
  border-radius: 16px;
  background: ${club.tint};
  padding: 16px;
  margin-bottom: 14px;
`;

const Big = styled.div`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;

  small {
    font-size: 16px;
    font-weight: 500;
    color: ${club.ink2};
  }
`;

const Lead = styled.p`
  font-size: 15px;
  color: ${club.ink2};
  margin: 4px 0 0;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid ${club.divider};

  & > div {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
  }

  small {
    display: block;
    font-weight: 400;
    font-size: 13px;
    color: ${club.ink2};
    margin-top: 2px;
    line-height: 1.35;
  }
`;

const Switch = styled.button`
  width: 51px;
  height: 31px;
  border-radius: 999px;
  border: 0;
  background: ${club.fillStrong};
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: ${club.surface};
    box-shadow: ${club.shadowKnob};
    transition: transform 0.2s;
  }

  &[aria-checked="true"] {
    background: ${club.accent};
  }

  &[aria-checked="true"]::after {
    transform: translateX(20px);
  }

  &:disabled {
    cursor: default;
  }
`;

const FeeRows = styled.div`
  margin-top: 14px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 9px 0;
    font-size: 15px;
    border-top: 1px solid ${club.divider};
  }

  span {
    color: ${club.ink2};
  }

  b {
    font-weight: 600;
    text-align: right;
  }
`;

// Dates here are estimates from the phone's clock, before signing and on the success screen right after it.
// The contract sets the real ones on subscribe; the card and the club page show those.
const fromNow = (seconds: number) => formatDate(new Date(Date.now() + seconds * 1000));

// auto renew pre-approves a limited number of charges (see periodsFor), so the copy says how many
// Nothing charges on a timer: each renewal is charged when the app runs billing (Process, in Developer tools)
const BILLING_NOTE = "Pi Bakery charges each renewal when it runs billing.";
const upTo = (count: number) => `up to ${count} ${count === 1 ? "charge" : "charges"}`;

const planCopy = (plan: Plan, keepAfterTrial: boolean) => {
  const price = formatPi(plan.price);
  const period = describePeriod(plan.periodSecs);
  if (plan.trialSecs > 0) {
    const trial = describePeriod(plan.trialSecs);
    return keepAfterTrial
      ? {
          cta: "Start free trial",
          lead: `Free for ${trial.span}, then ${price} Test-Pi${period.per}.`,
          fine: `Free until ${fromNow(plan.trialSecs)}. Then ${price} Test-Pi ${period.every}, ${upTo(periodsFor(plan, true))}. ${BILLING_NOTE}`,
        }
      : {
          cta: "Start free trial",
          lead: `Free for ${trial.span}. Doesn't renew.`,
          fine: `Free until ${fromNow(plan.trialSecs)}. The trial doesn't renew.`,
        };
  }
  return {
    cta: `Subscribe for ${price} Test-Pi${period.per}`,
    lead: `Billed ${period.every}, ${upTo(periodsFor(plan, true))} after today. Next charge due ${fromNow(plan.periodSecs)}.`,
    fine: BILLING_NOTE,
  };
};

const Result = ({
  flow,
  onResetFlow,
  onClose,
  onOpenClub,
  onCheckAgain,
  onCheckPending,
  walletCheck,
}: {
  flow: Exclude<SubscribeFlow, { phase: "idle" | "signing" | "confirming" }>;
  onResetFlow: () => void;
  onClose: () => void;
  onOpenClub: () => void;
  onCheckAgain: () => void;
  onCheckPending: () => Promise<"landed" | "failed" | "notYet" | "unknown">;
  walletCheck: WalletCheck;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pendingNote, setPendingNote] = useState<string | null>(null);
  const [checkingPending, setCheckingPending] = useState(false);
  const { plan, autoRenew } = flow;
  const price = formatPi(plan.price);
  const period = describePeriod(plan.periodSecs);
  const isTrial = plan.trialSecs > 0;
  // the contract now lists this plan as active, e.g. a transaction that landed after we stopped waiting
  const landedAfterAll = walletCheck.status === "ready" && walletCheck.activeServiceIds.includes(plan.serviceId);

  if (flow.phase === "already") {
    return (
      <div role="status">
        <ResultIcon $tone="ok">
          <CheckIcon />
        </ResultIcon>
        <ResultTitle>You already have this plan</ResultTitle>
        <ResultBody>
          Your wallet is already subscribed to {plan.name}, so this attempt didn't change anything.
        </ResultBody>
        <Stack>
          <Cta onClick={onOpenClub}>Open Pi Bakery Club</Cta>
          <Ghost onClick={onClose}>Done</Ghost>
        </Stack>
      </div>
    );
  }

  if (flow.phase === "success" || (flow.phase !== "failed" && landedAfterAll)) {
    const rows: [string, string][] = isTrial
      ? [
          ["Plan", autoRenew ? `${plan.name}, then ${period.every}` : `${plan.name}, trial only`],
          ["Free until", fromNow(plan.trialSecs)],
          ["After that", autoRenew ? `${price} Test-Pi${period.per}` : "Ends"],
        ]
      : [
          ["Plan", plan.name],
          ["Charged today", `${price} Test-Pi`],
          ["Next charge due", fromNow(plan.periodSecs)],
        ];
    return (
      <div role="status">
        <ResultIcon $tone="ok">
          <CheckIcon />
        </ResultIcon>
        <ResultTitle>{isTrial ? "Your free trial has started" : "You're subscribed"}</ResultTitle>
        <ResultBody>
          {isTrial
            ? autoRenew
              ? `It becomes ${price} Test-Pi${period.per} from ${fromNow(plan.trialSecs)}. ${BILLING_NOTE}`
              : "Enjoy. It doesn't renew."
            : `It renews ${period.every}, ${upTo(periodsFor(plan, true))} after today. ${BILLING_NOTE}`}
        </ResultBody>
        <Rows>
          {rows.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </Rows>
        <Stack>
          <Cta onClick={onOpenClub}>Open Pi Bakery Club</Cta>
          <Ghost onClick={onClose}>Done</Ghost>
        </Stack>
      </div>
    );
  }

  const checkAgain = () => {
    setChecked(true);
    onCheckAgain();
  };
  // what the last "Check again" found, while the outcome is still unknown
  const checkNote = !checked
    ? null
    : walletCheck.status === "checking"
      ? "Checking…"
      : walletCheck.status === "failed"
        ? walletCheck.error
        : "Not there yet. It can take a little longer, so check again in a minute.";

  const checkPending = async () => {
    setCheckingPending(true);
    setPendingNote("Checking…");
    const outcome = await onCheckPending();
    setCheckingPending(false);
    // landed or failed switch this screen to the outcome; the note is only for the unknowns
    setPendingNote(
      outcome === "notYet"
        ? "Not there yet. It can take a little longer, so check again in a minute."
        : outcome === "unknown"
          ? "Couldn't check right now. Try again in a minute."
          : null
    );
  };

  if (flow.phase === "unconfirmed") {
    return (
      <div role="status">
        <ResultIcon $tone="warn">
          <WarningAmberRoundedIcon />
        </ResultIcon>
        <ResultTitle>Still waiting for Pi Testnet</ResultTitle>
        <ResultBody>
          Your subscription hasn't landed yet. It may still go through: check again in a minute. After about three
          minutes the check can tell for sure.
        </ResultBody>
        {pendingNote && <Fine role="status">{pendingNote}</Fine>}
        <Stack>
          <Cta onClick={checkPending} disabled={checkingPending}>
            Check again
          </Cta>
          <Ghost onClick={onClose}>Done</Ghost>
        </Stack>
      </div>
    );
  }

  const landed = flow.phase === "failed";
  return (
    <div role="alert">
      <ResultIcon $tone="warn">
        <WarningAmberRoundedIcon />
      </ResultIcon>
      <ResultTitle>{landed ? "Subscription didn't go through" : "Couldn't start the subscription"}</ResultTitle>
      <ResultBody>
        {landed
          ? flow.expired
            ? "The transaction expired before it reached Pi Testnet, so nothing was charged. Your plan choice is kept."
            : "Pi Testnet rejected the transaction. Your plan choice is kept."
          : "Something went wrong and the subscription wasn't confirmed. It may still have gone through, so check before trying again."}
      </ResultBody>
      {checkNote && <Fine role="status">{checkNote}</Fine>}
      {showDetails && <Detail>{flow.details}</Detail>}
      <Stack>
        {landed ? (
          <Cta onClick={onResetFlow}>Try again</Cta>
        ) : (
          <Cta onClick={checkAgain} disabled={walletCheck.status === "checking"}>
            Check again
          </Cta>
        )}
        {!landed && <Ghost onClick={onResetFlow}>Try again</Ghost>}
        <Ghost onClick={() => setShowDetails(shown => !shown)}>{showDetails ? "Hide" : "Show"} details</Ghost>
      </Stack>
    </div>
  );
};

const PlanSheet = ({
  plans,
  initialServiceId,
  flow,
  onSubscribe,
  onResetFlow,
  onClose,
  onOpenClub,
  onCheckAgain,
  onCheckPending,
  walletAddress,
  walletCheck,
}: PlanSheetProps) => {
  // reopened during or after an attempt, the sheet starts from that attempt's choices, not the defaults
  const [serviceId, setServiceId] = useState(flow.phase === "idle" ? initialServiceId : flow.plan.serviceId);
  const [keepAfterTrial, setKeepAfterTrial] = useState(flow.phase === "idle" ? true : flow.autoRenew);
  const sheetRef = useRef<HTMLDivElement>(null);

  const busy = flow.phase === "signing" || flow.phase === "confirming";
  // while subscribing, the sheet describes the plan being subscribed to
  const plan = busy ? flow.plan : (plans.find(p => p.serviceId === serviceId) ?? plans[0]);
  const isTrial = plan.trialSecs > 0;
  // while subscribing, the switch shows what is being signed
  const keepAfter = busy ? flow.autoRenew : keepAfterTrial;
  const autoRenew = isTrial ? keepAfter : true;
  const copy = planCopy(plan, keepAfter);
  const period = describePeriod(plan.periodSecs);
  const alreadySubscribed = walletCheck.status === "ready" && walletCheck.activeServiceIds.includes(plan.serviceId);
  const canSubscribe = walletAddress !== null && walletCheck.status === "ready" && !alreadySubscribed;

  // closing after an outcome starts the next visit from the plan choice
  const close = () => {
    // a pending subscription is kept, so the card can say so and nothing new is started over it
    if (!busy && flow.phase !== "unconfirmed") {
      onResetFlow();
    }
    onClose();
  };
  // the Escape listener is added once, so it reads the latest close through a ref
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  // when the plan choice is replaced by an outcome, the focused button goes with it: focus the sheet again
  const showingResult = flow.phase !== "idle" && !busy;
  useEffect(() => {
    if (showingResult) {
      sheetRef.current?.focus();
    }
  }, [showingResult]);

  // a modal: focus moves in and goes back where it came from on close, Tab stays inside, Escape closes
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      const sheet = sheetRef.current;
      if (e.key !== "Tab" || !sheet) {
        return;
      }
      const focusable = [...sheet.querySelectorAll<HTMLElement>("button, input")].filter(
        el => !el.hasAttribute("disabled")
      );
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (opener?.isConnected) {
        opener.focus();
      }
    };
  }, []);

  return (
    <>
      <Scrim onClick={close} />
      <Sheet
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={flow.phase === "idle" || busy ? "Choose your plan" : "Subscription result"}
      >
        <Grab aria-hidden="true" />
        <Top>
          <h3>{flow.phase === "idle" || busy ? "Choose your plan" : "Pi Bakery Club"}</h3>
          <CloseButton onClick={close} aria-label="Close">
            <CloseIcon fontSize="small" />
          </CloseButton>
        </Top>

        {flow.phase !== "idle" && !busy ? (
          <Result
            flow={flow}
            onResetFlow={onResetFlow}
            onClose={close}
            onOpenClub={onOpenClub}
            onCheckAgain={onCheckAgain}
            onCheckPending={onCheckPending}
            walletCheck={walletCheck}
          />
        ) : (
          <>
            <Segments role="group" aria-label="Plan" $count={plans.length}>
              {plans.map(p => (
                <button
                  key={p.serviceId}
                  aria-pressed={p.serviceId === plan.serviceId}
                  disabled={busy}
                  onClick={() => setServiceId(p.serviceId)}
                >
                  {p.name}
                </button>
              ))}
            </Segments>

            <Summary>
              <Big>
                {isTrial ? (
                  <>
                    Free <small>for {describePeriod(plan.trialSecs).span}</small>
                  </>
                ) : (
                  <>
                    {formatPi(plan.price)} Test-Pi <small>{period.per}</small>
                  </>
                )}
              </Big>
              <Lead>{copy.lead}</Lead>

              {isTrial && (
                <SwitchRow>
                  <div>
                    Continue after the trial
                    <small id="club-trial-switch-description">
                      {keepAfter
                        ? `${formatPi(plan.price)} Test-Pi${period.per} from ${fromNow(plan.trialSecs)}, ${upTo(periodsFor(plan, true))}.`
                        : `The trial ends ${fromNow(plan.trialSecs)} and doesn't renew.`}
                    </small>
                  </div>
                  <Switch
                    role="switch"
                    aria-checked={keepAfter}
                    aria-label="Continue after the trial"
                    aria-describedby="club-trial-switch-description"
                    disabled={busy}
                    onClick={() => setKeepAfterTrial(keep => !keep)}
                  />
                </SwitchRow>
              )}

              <FeeRows>
                <div>
                  <span>Due today</span>
                  <b>{isTrial ? 0 : formatPi(plan.price)} Test-Pi</b>
                </div>
                <div>
                  <span>Network fee</span>
                  <b>Shown in your Pi Wallet</b>
                </div>
              </FeeRows>
            </Summary>

            <Cta onClick={() => onSubscribe(plan, autoRenew)} disabled={busy || !canSubscribe} aria-busy={busy}>
              {flow.phase === "signing" && (
                <>
                  <Spinner aria-hidden="true" />
                  Confirm in your Pi Wallet…
                </>
              )}
              {flow.phase === "confirming" && (
                <>
                  <Spinner aria-hidden="true" />
                  Confirming on Pi Testnet… {flow.seconds}s
                </>
              )}
              {!busy && copy.cta}
            </Cta>
            <Fine role="status">
              {flow.phase === "confirming"
                ? "Usually a few seconds."
                : busy
                  ? copy.fine || "You confirm it in your Pi Wallet."
                  : walletCheck.status === "checking"
                    ? "Checking your wallet's subscriptions…"
                    : walletCheck.status === "failed"
                      ? walletCheck.error
                      : alreadySubscribed
                        ? "You already have this plan. Pick another one, or close this to see it."
                        : `${copy.fine ? `${copy.fine} ` : ""}From your wallet ${walletAddress ? shortAddress(walletAddress) : ""}, confirmed in your Pi Wallet.`}
            </Fine>
          </>
        )}
      </Sheet>
    </>
  );
};

export default PlanSheet;
