import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { MySubscription } from "../../hooks/club/plans";
import { formatDate, fromChainTime, shortAddress } from "../../utils/subscription";
import { PlanRow } from "./club.styles";
import { subscriptionLine } from "./copy";

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
  return (
    <>
      <PlanRow>
        <Box flex={1}>
          <Typography fontWeight={600} color={ended ? "text.secondary" : "text.primary"}>
            {mine.plan.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!ended
              ? subscriptionLine(mine)
              : mine.hasEnded && `Ended ${formatDate(fromChainTime(mine.subscription.service_end_ts))}`}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={!ended ? "Active" : mine.hasEnded ? "Expired" : "Not active"}
          color={ended ? "default" : "primary"}
        />
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
