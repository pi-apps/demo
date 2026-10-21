import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { MySubscription } from "../../hooks/club/plans";
import { chainDate, shortAddress } from "../../utils/subscription";
import { PlanRow } from "./club.styles";
import { subscriptionLine } from "./copy";

// the chip and the line under the plan name
const describe = (mine: MySubscription) => {
  if (mine.active) return { chip: "Active", line: subscriptionLine(mine) };
  if (!mine.hasEnded) return { chip: "Not active", line: null };
  return { chip: "Expired", line: `Ended ${chainDate(mine.subscription.service_end_ts)}` };
};

// the user's plan on the card: active (with a way into the club), or ended (with a way back in)
const PlanStatus = ({
  mine,
  onOpenClub,
  onResubscribe,
}: {
  mine: MySubscription;
  onOpenClub: () => void;
  onResubscribe: () => void;
}) => {
  const ended = !mine.active;
  const { chip, line } = describe(mine);
  return (
    <>
      <PlanRow>
        <Box flex={1}>
          <Typography fontWeight={600} color={ended ? "text.secondary" : "text.primary"}>
            {mine.plan.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {line}
          </Typography>
        </Box>
        <Chip size="small" label={chip} color={ended ? "default" : "primary"} />
      </PlanRow>
      {ended ? (
        <Button variant="contained" size="large" onClick={onResubscribe}>
          Resubscribe
        </Button>
      ) : (
        <>
          <Button variant="contained" size="large" onClick={onOpenClub}>
            Open Pi Bakery Club
          </Button>
          <Typography variant="body2" color="text.secondary" align="center" mt={1}>
            Wallet {shortAddress(mine.subscription.subscriber)}
          </Typography>
        </>
      )}
    </>
  );
};

export default PlanStatus;
