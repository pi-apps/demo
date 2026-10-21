import { useState, type ReactNode } from "react";
import styled from "styled-components";
import BakeryDiningOutlinedIcon from "@mui/icons-material/BakeryDiningOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  defaultPlan,
  planToResubscribe,
  useClub,
  type MySubscription,
  type Plan,
} from "../../hooks/useClubSubscription";
import { describePeriod, formatDate, formatPi, fromChainTime, shortAddress } from "../../utils/subscription";
import FailureNote from "./FailureNote";
import PlanSheet, { type WalletCheck } from "./PlanSheet";
import {
  ActiveRow,
  Card,
  club,
  Cta,
  Fine,
  Ghost,
  Head,
  LinkButton,
  Mark,
  Note,
  Pill,
  Spinner,
  Stack,
  Sub,
  Title,
} from "./styles";

interface SubscriptionSectionProps {
  onOpenClub: () => void;
  // opens the plan sheet straight away, e.g. after Subscribe on the club page, on this plan if given
  openOnMount?: { serviceId: string | null } | null;
  // the original subscription form, for core_team
  developerTools?: ReactNode;
}

const DevTools = styled.div`
  margin-top: 14px;
  border-top: 1px solid ${club.line};
  padding-top: 4px;
`;

const DevToggle = styled.button<{ $open: boolean }>`
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: ${club.ink2};
  cursor: pointer;
  padding: 0 2px;

  svg {
    transition: transform 0.2s;
    transform: ${({ $open }) => ($open ? "rotate(180deg)" : "none")};
  }
`;

// the original form keeps the app's original look, including the browser's own buttons that the club
// styles reset everywhere else
const Legacy = styled.div`
  font-family: -apple-system-body, "Helvetica Neue", Helvetica, sans-serif;
  color: ${club.ink};

  button {
    -webkit-appearance: revert;
    appearance: revert;
    font: revert;
    letter-spacing: revert;
  }
`;

const ActivePlan = ({ mine, onOpenClub }: { mine: MySubscription; onOpenClub: () => void }) => {
  const { subscription } = mine;
  const price = formatPi(BigInt(subscription.price));
  const period = describePeriod(Number(subscription.period_secs));
  const trialEnd = formatDate(fromChainTime(subscription.trial_end_ts));
  const { inTrial } = mine;
  const line = inTrial
    ? subscription.auto_renew
      ? `Free until ${trialEnd}, then ${price} Test-Pi${period.per}`
      : `Free until ${trialEnd}, then ends`
    : subscription.auto_renew
      ? `Next charge due ${formatDate(fromChainTime(subscription.next_charge_ts))} · ${price} Test-Pi`
      : `Ends ${formatDate(fromChainTime(subscription.service_end_ts))}`;

  return (
    <>
      <ActiveRow>
        <div>
          {mine.plan.name}
          <small>{line}</small>
        </div>
        <Pill>Active</Pill>
      </ActiveRow>
      <Cta onClick={onOpenClub}>Open Pi Bakery Club</Cta>
      <Fine>Wallet {shortAddress(mine.subscription.subscriber)}</Fine>
    </>
  );
};

const EndedPlan = ({ mine, onResubscribe }: { mine: MySubscription; onResubscribe: () => void }) => {
  return (
    <>
      <ActiveRow $muted>
        <div>
          {mine.plan.name}
          {mine.hasEnded && <small>Ended {formatDate(fromChainTime(mine.subscription.service_end_ts))}</small>}
        </div>
        <Pill $muted>{mine.hasEnded ? "Expired" : "Not active"}</Pill>
      </ActiveRow>
      <Cta onClick={onResubscribe}>Resubscribe</Cta>
    </>
  );
};

const SubscriptionSection = ({ onOpenClub, openOnMount, developerTools }: SubscriptionSectionProps) => {
  const { walletAddress, plans, status, retry, refresh, flow, subscribe, resetFlow, checkPending } = useClub();
  const [sheet, setSheet] = useState<{ serviceId: string | null } | null>(openOnMount ?? null);
  const [devOpen, setDevOpen] = useState(false);

  const busy = flow.phase === "signing" || flow.phase === "confirming";
  const walletCheck: WalletCheck =
    status.status === "loading"
      ? { status: "checking" }
      : status.status === "error"
        ? { status: "failed", error: status.error }
        : { status: "ready", activeServiceIds: status.value?.activeServiceIds ?? [] };
  // an attempt that finishes while the sheet is closed reopens it, so its outcome is never lost
  // (a pending one is not reopened: it stays on the card until it is checked)
  const hasResult = flow.phase !== "idle" && flow.phase !== "unconfirmed" && !busy;
  const trialPlan = plans.find(plan => plan.trialSecs > 0);
  const openSheet = (plan?: Plan) => setSheet({ serviceId: plan?.serviceId ?? null });

  let body: ReactNode;
  // a pending attempt whose plan the contract now lists as active has landed: the active plan wins
  const pendingLanded =
    flow.phase === "unconfirmed" &&
    status.status === "ready" &&
    !!status.value?.activeServiceIds.includes(flow.plan.serviceId);
  if (flow.phase === "unconfirmed" && !pendingLanded && !sheet) {
    body = (
      <Note role="status">
        Your subscription is still pending on Pi Testnet.{" "}
        <LinkButton onClick={() => setSheet({ serviceId: null })}>Check</LinkButton>
      </Note>
    );
  } else if (busy && !sheet) {
    body = (
      <Note role="status">
        <Spinner aria-hidden="true" />
        Subscribing… <LinkButton onClick={() => setSheet({ serviceId: null })}>Show</LinkButton>
      </Note>
    );
  } else if (status.status === "loading") {
    body = (
      <Note role="status">
        <Spinner aria-hidden="true" />
        Checking your subscription…
      </Note>
    );
  } else if (status.status === "error") {
    body = <FailureNote failure={status} onRetry={retry} />;
  } else if (status.value?.active) {
    body = <ActivePlan mine={status.value} onOpenClub={onOpenClub} />;
  } else if (plans.length === 0) {
    body = <Note>No plans are set up for this app yet.</Note>;
  } else if (status.value) {
    const mine = status.value;
    body = <EndedPlan mine={mine} onResubscribe={() => openSheet(planToResubscribe(plans, mine))} />;
  } else {
    body = (
      <Stack>
        <Cta onClick={() => openSheet(defaultPlan(plans))}>Subscribe</Cta>
        {trialPlan && (
          <Ghost onClick={() => openSheet(trialPlan)}>Try free for {describePeriod(trialPlan.trialSecs).span}</Ghost>
        )}
      </Stack>
    );
  }

  return (
    <Card aria-label="Pi Bakery Club subscription">
      <Head>
        <Mark aria-hidden="true">
          <BakeryDiningOutlinedIcon />
        </Mark>
        <div>
          <Title>Pi Bakery Club</Title>
          <Sub>Test the subscription feature on Pi Testnet.</Sub>
        </div>
      </Head>

      {body}

      {developerTools && (
        <DevTools>
          <DevToggle $open={devOpen} aria-expanded={devOpen} onClick={() => setDevOpen(open => !open)}>
            <span>Developer tools (core_team)</span>
            <ExpandMoreIcon />
          </DevToggle>
          {devOpen && <Legacy>{developerTools}</Legacy>}
        </DevTools>
      )}

      {(sheet || hasResult) && (busy || hasResult || plans.length > 0) && (
        <PlanSheet
          plans={plans}
          initialServiceId={sheet?.serviceId ?? defaultPlan(plans)?.serviceId ?? ""}
          flow={flow}
          onSubscribe={subscribe}
          // a sheet that reopened on its own for a result stays open when the user goes back to the plans
          onResetFlow={() => {
            setSheet(open => open ?? { serviceId: null });
            resetFlow();
          }}
          onClose={() => setSheet(null)}
          onCheckAgain={refresh}
          onCheckPending={checkPending}
          walletAddress={walletAddress}
          walletCheck={walletCheck}
          onOpenClub={() => {
            resetFlow();
            onOpenClub();
          }}
        />
      )}
    </Card>
  );
};

export default SubscriptionSection;
