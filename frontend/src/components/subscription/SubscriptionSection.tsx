import { useState, type ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import BakeryDiningOutlinedIcon from "@mui/icons-material/BakeryDiningOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { defaultPlan, hasActivePlan, planFor, planToResubscribe, type Plan } from "../../hooks/club/plans";
import { isBusy } from "../../hooks/club/useSubscribeAttempt";
import { useClub } from "../../hooks/useClubSubscription";
import { describePeriod } from "../../utils/subscription";
import { Column, Row } from "../lib";
import { ClubCard, ClubMark } from "./club.styles";
import { clubTheme } from "./clubTheme";
import FailureNote from "./FailureNote";
import PlanSheet from "./PlanSheet";
import PlanStatus from "./PlanStatus";
import Progress from "./Progress";
import { DevToggle, Legacy } from "./SubscriptionSection.styles";

interface SubscriptionSectionProps {
  onOpenClub: () => void;
  // opens the plan sheet straight away, e.g. after Subscribe on the club page, on this plan if given
  openOnMount?: { serviceId: string | null } | null;
  // the original subscription form, for core_team
  developerTools?: ReactNode;
}

// the open sheet: the plan it starts on (null for the default) and, after "Try again", the trial switch as it was
type SheetState = { serviceId: string | null; keepAfterTrial?: boolean } | null;

const SubscriptionSection = ({ onOpenClub, openOnMount, developerTools }: SubscriptionSectionProps) => {
  const club = useClub();
  const { plans, status, flow } = club;
  const [sheet, setSheet] = useState<SheetState>(openOnMount ?? null);
  const [devOpen, setDevOpen] = useState(false);
  const openSheet = (plan?: Plan) => setSheet({ serviceId: plan?.serviceId ?? null });

  const busy = isBusy(flow);
  // an attempt that finishes while the sheet is closed reopens it, so its outcome is never lost (a pending one
  // stays on the card instead, until it is checked)
  const hasResult = flow.phase !== "idle" && flow.phase !== "unconfirmed" && !busy;
  // a pending attempt whose plan the contract now lists as active has landed: the active plan wins
  const pendingLanded = flow.phase === "unconfirmed" && hasActivePlan(status, flow.plan.serviceId);
  // offered only while this wallet has not had the trial
  const trialPlan = plans.find(plan => planFor(status, plan).trialSecs > 0);

  let body: ReactNode;
  if (flow.phase === "unconfirmed" && !pendingLanded && !sheet) {
    body = (
      <Alert
        severity="info"
        role="status"
        action={
          <Button size="small" fullWidth={false} onClick={() => openSheet()}>
            Check
          </Button>
        }
      >
        Your subscription is still pending on Pi Testnet.
      </Alert>
    );
  } else if (busy && !sheet) {
    body = (
      <Progress>
        Subscribing…{" "}
        <Link component="button" onClick={() => openSheet()}>
          Show
        </Link>
      </Progress>
    );
  } else if (status.status === "loading") {
    body = <Progress>Checking your subscription…</Progress>;
  } else if (status.status === "error") {
    body = <FailureNote failure={status} onRetry={club.retry} />;
  } else if (status.value && (status.value.active || plans.length > 0)) {
    const mine = status.value;
    body = (
      <PlanStatus
        mine={mine}
        onOpenClub={onOpenClub}
        onResubscribe={() => openSheet(planToResubscribe(plans, mine))}
        onChooseAnother={() => openSheet(plans.find(plan => plan.serviceId !== mine.plan.serviceId))}
        onCheckAgain={club.refresh}
      />
    );
  } else if (plans.length === 0) {
    body = <Alert severity="info">No plans are set up for this app yet.</Alert>;
  } else {
    body = (
      <Column gap={1}>
        <Button variant="contained" size="large" onClick={() => openSheet(defaultPlan(plans))}>
          Subscribe
        </Button>
        {trialPlan && (
          <Button onClick={() => openSheet(trialPlan)}>Try free for {describePeriod(trialPlan.trialSecs).span}</Button>
        )}
      </Column>
    );
  }

  return (
    <ThemeProvider theme={clubTheme}>
      <ClubCard aria-label="Pi Bakery Club subscription">
        <Row gap={1.75} mb={2}>
          <ClubMark aria-hidden="true">
            <BakeryDiningOutlinedIcon />
          </ClubMark>
          <div>
            <Typography variant="h6" component="h2" fontWeight={700}>
              Pi Bakery Club
            </Typography>
            <Typography color="text.secondary">Test the subscription feature on Pi Testnet.</Typography>
          </div>
        </Row>

        {body}

        {developerTools && (
          <>
            <DevToggle
              open={devOpen}
              aria-expanded={devOpen}
              endIcon={<ExpandMoreIcon />}
              onClick={() => setDevOpen(open => !open)}
            >
              Developer tools (core_team)
            </DevToggle>
            <Collapse in={devOpen} unmountOnExit>
              <Legacy>{developerTools}</Legacy>
            </Collapse>
          </>
        )}

        {(plans.length > 0 || flow.phase !== "idle") && (
          <PlanSheet
            open={Boolean(sheet || hasResult)}
            plans={plans}
            initialServiceId={sheet?.serviceId ?? defaultPlan(plans)?.serviceId ?? ""}
            initialKeepAfterTrial={sheet?.keepAfterTrial ?? true}
            flow={flow}
            status={status}
            walletAddress={club.walletAddress}
            onSubscribe={club.subscribe}
            // back to the plans after a result, on the plan and trial choice that was tried; a sheet that reopened
            // on its own for the result stays open
            onResetFlow={() => {
              if (flow.phase !== "idle") {
                setSheet({ serviceId: flow.plan.serviceId, keepAfterTrial: flow.autoRenew });
              }
              club.reset();
            }}
            onClose={() => setSheet(null)}
            onOpenClub={() => {
              club.reset();
              onOpenClub();
            }}
            onCheckAgain={club.refresh}
            onCheckPending={club.checkPending}
          />
        )}
      </ClubCard>
    </ThemeProvider>
  );
};

export default SubscriptionSection;
