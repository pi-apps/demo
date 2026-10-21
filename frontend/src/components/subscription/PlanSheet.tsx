import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import type { Loadable, MySubscription, Plan } from "../../hooks/club/plans";
import { type PendingCheck, type SubscribeFlow, isBusy } from "../../hooks/club/useSubscribeAttempt";
import { Row } from "../lib";
import PlanChoice from "./PlanChoice";
import { SheetDrawer } from "./PlanSheet.styles";
import SubscribeResult from "./SubscribeResult";

interface PlanSheetProps {
  open: boolean;
  plans: Plan[];
  initialServiceId: string;
  initialKeepAfterTrial: boolean;
  flow: SubscribeFlow;
  status: Loadable<MySubscription | null>;
  walletAddress: string | null;
  onSubscribe: (plan: Plan, autoRenew: boolean) => void;
  onResetFlow: () => void;
  onClose: () => void;
  onOpenClub: () => void;
  onCheckAgain: () => void;
  onCheckPending: () => Promise<PendingCheck>;
}

// The bottom sheet: the plan choice, or the outcome of an attempt. MUI's Drawer brings the focus trap, Escape,
// focus restore, backdrop and slide; its content mounts afresh on every open.
const PlanSheet = ({ open, flow, onResetFlow, onClose, ...props }: PlanSheetProps) => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const busy = isBusy(flow);
  const showingResult = flow.phase !== "idle" && !busy;

  // a pending subscription is kept on close, so the card can say so and nothing new is started over it
  const close = () => {
    if (!busy && flow.phase !== "unconfirmed") {
      onResetFlow();
    }
    onClose();
  };

  return (
    <SheetDrawer
      anchor="bottom"
      open={open}
      onClose={close}
      transitionDuration={reduceMotion ? 0 : undefined}
      slotProps={{ paper: { "aria-label": showingResult ? "Subscription result" : "Choose your plan" } }}
    >
      <Row justifyContent="space-between" mb={2}>
        <Typography variant="h6" component="h2" fontWeight={700}>
          {showingResult ? "Pi Bakery Club" : "Choose your plan"}
        </Typography>
        <IconButton onClick={close} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Row>
      {showingResult ? (
        <SubscribeResult
          flow={flow}
          status={props.status}
          onTryAgain={onResetFlow}
          onDone={close}
          onOpenClub={props.onOpenClub}
          onCheckAgain={props.onCheckAgain}
          onCheckPending={props.onCheckPending}
        />
      ) : (
        <PlanChoice
          plans={props.plans}
          initialServiceId={props.initialServiceId}
          initialKeepAfterTrial={props.initialKeepAfterTrial}
          flow={flow}
          status={props.status}
          walletAddress={props.walletAddress}
          onSubscribe={props.onSubscribe}
        />
      )}
    </SheetDrawer>
  );
};

export default PlanSheet;
