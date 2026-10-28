import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { awaitsRenewal, type MySubscription } from "../../hooks/club/plans";
import { chainDate, shortAddress } from "../../utils/subscription";
import { PlanRow } from "./club.styles";
import { subscriptionLine } from "./copy";

interface PlanStatusProps {
  mine: MySubscription;
  onOpenClub: () => void;
  onResubscribe: () => void;
  onCheckAgain: () => void;
  onChooseAnother: () => void;
}

// the chip and the line under the plan name
const describe = (mine: MySubscription) => {
  if (mine.active) return { chip: "Active", line: subscriptionLine(mine) };
  if (awaitsRenewal(mine))
    return { chip: "Renewal due", line: `Ran out ${chainDate(mine.subscription.service_end_ts)}` };
  if (!mine.hasEnded) return { chip: "Not active", line: null };
  return { chip: "Expired", line: `Ended ${chainDate(mine.subscription.service_end_ts)}` };
};

// what the card offers below the plan: the club, a check for the renewal charge, or a way back in
const PlanAction = ({ mine, onOpenClub, onResubscribe, onCheckAgain, onChooseAnother }: PlanStatusProps) => {
  if (mine.active) {
    return (
      <>
        <Button variant="contained" size="large" onClick={onOpenClub}>
          Open Pi Bakery Club
        </Button>
        <Typography variant="body2" color="text.secondary" align="center" mt={1}>
          Wallet {shortAddress(mine.subscription.subscriber)}
        </Typography>
      </>
    );
  }
  if (awaitsRenewal(mine)) {
    // the contract will not start this plan again until the renewal is charged, so Resubscribe would fail
    return (
      <>
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          It renews automatically, so it opens again once Pi Bakery charges the renewal when it runs billing.
        </Typography>
        <Button variant="contained" size="large" onClick={onCheckAgain}>
          Check again
        </Button>
        <Button onClick={onChooseAnother}>Choose another plan</Button>
      </>
    );
  }
  return (
    <Button variant="contained" size="large" onClick={onResubscribe}>
      Resubscribe
    </Button>
  );
};

// the user's plan on the card: active, waiting for its renewal charge, or ended
const PlanStatus = (props: PlanStatusProps) => {
  const { mine } = props;
  const { chip, line } = describe(mine);
  return (
    <>
      <PlanRow>
        <Box flex={1}>
          <Typography fontWeight={600} color={mine.active ? "text.primary" : "text.secondary"}>
            {mine.plan.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {line}
          </Typography>
        </Box>
        <Chip size="small" label={chip} color={mine.active ? "primary" : "default"} />
      </PlanRow>
      <PlanAction {...props} />
    </>
  );
};

export default PlanStatus;
