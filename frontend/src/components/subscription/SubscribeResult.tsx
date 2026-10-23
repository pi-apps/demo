import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { hasActivePlan, type Loadable, type MySubscription } from "../../hooks/club/plans";
import type { PendingCheck } from "../../hooks/club/useSubscribeAttempt";
import { ResultIcon } from "./club.styles";
import InfoRows from "./InfoRows";
import { outcomeKind, outcomeText, pendingNote, rereadNote, summaryRows, type Outcome } from "./outcomeCopy";
import RawError from "./RawError";

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

const SubscribeResult = (props: SubscribeResultProps) => {
  const { flow, status, onTryAgain, onDone, onOpenClub, onCheckAgain, onCheckPending } = props;
  // what "Check again" found while the outcome is still unknown
  const [pendingFound, setPendingFound] = useState<string | null>(null);
  const [reread, setReread] = useState(false);
  const [checking, setChecking] = useState(false);

  const kind = outcomeKind(flow, hasActivePlan(status, flow.plan.serviceId));
  const { title, body } = outcomeText(kind, flow);
  const succeeded = kind === "success" || kind === "already";

  const checkPending = async () => {
    setChecking(true);
    setPendingFound("Checking…");
    setPendingFound(pendingNote(await onCheckPending()));
    setChecking(false);
  };
  const recheck = () => {
    setReread(true);
    onCheckAgain();
  };

  let note: string | null = null;
  if (kind === "pending") note = pendingFound;
  if (kind === "uncertain" && reread) note = rereadNote(status);

  return (
    <div>
      <ResultIcon tone={succeeded ? "ok" : "warn"}>
        {succeeded ? <CheckIcon /> : <WarningAmberRoundedIcon />}
      </ResultIcon>
      <div role={kind === "failed" || kind === "uncertain" ? "alert" : "status"}>
        <Typography variant="h6" component="h3" align="center" fontWeight={700}>
          {title}
        </Typography>
        <Typography align="center" color="text.secondary" mb={2}>
          {body}
        </Typography>
      </div>
      {kind === "success" && <InfoRows rows={summaryRows(flow.plan, flow.autoRenew)} />}
      {note && (
        <Typography variant="body2" align="center" mb={1}>
          {note}
        </Typography>
      )}
      {"details" in flow && !succeeded && <RawError details={flow.details} />}

      <Stack gap={1} mt={2}>
        {succeeded && (
          <Button variant="contained" size="large" onClick={onOpenClub}>
            Open Pi Bakery Club
          </Button>
        )}
        {kind === "pending" && (
          <Button variant="contained" size="large" onClick={checkPending} disabled={checking}>
            Check again
          </Button>
        )}
        {kind === "uncertain" && (
          <Button variant="contained" size="large" onClick={recheck} disabled={status.status === "loading"}>
            Check again
          </Button>
        )}
        {kind === "failed" && (
          <Button variant="contained" size="large" onClick={onTryAgain}>
            Try again
          </Button>
        )}
        {kind === "uncertain" && <Button onClick={onTryAgain}>Try again</Button>}
        {(succeeded || kind === "pending") && <Button onClick={onDone}>Done</Button>}
      </Stack>
    </div>
  );
};

export default SubscribeResult;
