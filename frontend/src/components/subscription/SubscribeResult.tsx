import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { periodsFor, type Loadable, type MySubscription } from "../../hooks/club/plans";
import type { PendingCheck, SubscribeFlow } from "../../hooks/club/useSubscribeAttempt";
import { describePeriod } from "../../utils/subscription";
import { BILLING_NOTE, fromNow, price, upTo } from "./copy";
import { RawDetails, ResultIcon } from "./club.styles";

type Outcome = Exclude<SubscribeFlow, { phase: "idle" | "signing" | "confirming" }>;

interface SubscribeResultProps {
  flow: Outcome;
  // the wallet's subscriptions as last read: a plan listed as active means the attempt landed after all
  status: Loadable<MySubscription | null>;
  onTryAgain: () => void;
  onDone: () => void;
  onOpenClub: () => void;
  // reads the subscription again, and looks up a pending subscription's own transaction
  onCheckAgain: () => void;
  onCheckPending: () => Promise<PendingCheck>;
}

const NOT_YET = "Not there yet. It can take a little longer, so check again in a minute.";

const Heading = ({ tone, title, body }: { tone: "ok" | "warn"; title: string; body: string }) => (
  <>
    <ResultIcon tone={tone}>{tone === "ok" ? <CheckIcon /> : <WarningAmberRoundedIcon />}</ResultIcon>
    <Typography variant="h6" align="center" fontWeight={700}>
      {title}
    </Typography>
    <Typography align="center" color="text.secondary" mb={2}>
      {body}
    </Typography>
  </>
);

const SubscribeResult = (props: SubscribeResultProps) => {
  const { flow, status, onTryAgain, onDone, onOpenClub, onCheckAgain, onCheckPending } = props;
  const [note, setNote] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { plan, autoRenew } = flow;
  const period = describePeriod(plan.periodSecs);
  const landedAfterAll = status.status === "ready" && !!status.value?.activeServiceIds.includes(plan.serviceId);

  if (flow.phase === "already" || flow.phase === "success" || (flow.phase !== "failed" && landedAfterAll)) {
    const isTrial = plan.trialSecs > 0;
    const body =
      flow.phase === "already"
        ? `Your wallet is already subscribed to ${plan.name}, so this attempt didn't change anything.`
        : isTrial
          ? autoRenew
            ? `It becomes ${price(plan)}${period.per} from ${fromNow(plan.trialSecs)}. ${BILLING_NOTE}`
            : "Enjoy. It doesn't renew."
          : `It renews ${period.every}, ${upTo(periodsFor(plan, true))} after today. ${BILLING_NOTE}`;
    const title =
      flow.phase === "already"
        ? "You already have this plan"
        : isTrial
          ? "Your free trial has started"
          : "You're subscribed";
    return (
      <div role="status">
        <Heading tone="ok" title={title} body={body} />
        <Stack gap={1}>
          <Button variant="contained" size="large" onClick={onOpenClub}>
            Open Pi Bakery Club
          </Button>
          <Button onClick={onDone}>Done</Button>
        </Stack>
      </div>
    );
  }

  // a check whose answer is still unknown says what it found; landed or failed switch this screen instead
  const check = async () => {
    setChecking(true);
    setNote("Checking…");
    if (flow.phase === "unconfirmed") {
      const found = await onCheckPending();
      setNote(
        found === "notYet" ? NOT_YET : found === "unknown" ? "Couldn't check right now. Try again in a minute." : null
      );
    } else {
      onCheckAgain();
      setNote(NOT_YET);
    }
    setChecking(false);
  };
  const shownNote = note && flow.phase === "error" && status.status === "loading" ? "Checking…" : note;

  if (flow.phase === "unconfirmed") {
    return (
      <div role="status">
        <Heading
          tone="warn"
          title="Still waiting for Pi Testnet"
          body="Your subscription hasn't landed yet. It may still go through: check again in a minute. After about three minutes the check can tell for sure."
        />
        {shownNote && (
          <Typography variant="body2" align="center" mb={1}>
            {shownNote}
          </Typography>
        )}
        <Stack gap={1}>
          <Button variant="contained" size="large" onClick={check} disabled={checking}>
            Check again
          </Button>
          <Button onClick={onDone}>Done</Button>
        </Stack>
      </div>
    );
  }

  const failed = flow.phase === "failed";
  const body = !failed
    ? "Something went wrong and the subscription wasn't confirmed. It may still have gone through, so check before trying again."
    : flow.expired
      ? "The transaction expired before it reached Pi Testnet, so nothing was charged. Your plan choice is kept."
      : "Pi Testnet rejected the transaction. Your plan choice is kept.";
  return (
    <div role="alert">
      <Heading
        tone="warn"
        title={failed ? "Subscription didn't go through" : "Couldn't start the subscription"}
        body={body}
      />
      {shownNote && (
        <Typography variant="body2" align="center" mb={1}>
          {shownNote}
        </Typography>
      )}
      {showDetails && <RawDetails>{flow.details}</RawDetails>}
      <Stack gap={1}>
        {!failed && (
          <Button variant="contained" size="large" onClick={check} disabled={checking || status.status === "loading"}>
            Check again
          </Button>
        )}
        <Button variant={failed ? "contained" : "text"} size={failed ? "large" : "medium"} onClick={onTryAgain}>
          Try again
        </Button>
        <Button onClick={() => setShowDetails(shown => !shown)}>{showDetails ? "Hide" : "Show"} details</Button>
      </Stack>
    </div>
  );
};

export default SubscribeResult;
