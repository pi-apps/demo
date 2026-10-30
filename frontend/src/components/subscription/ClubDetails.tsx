import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { MySubscription } from "../../hooks/club/plans";
import { APP_WALLET_ADDRESS } from "../../hooks/useSubscriptions";
import { chainDate, describePeriod, formatTestPi, shortAddress } from "../../utils/subscription";
import { PlanRow } from "./club.styles";
import { SectionLabel, StepIcon } from "./ClubDetails.styles";
import InfoRows, { type InfoRow } from "./InfoRows";

const STEPS = [
  "Picked a plan in the app",
  "Reviewed and approved it in your Pi Wallet",
  "Confirmed on Pi Testnet",
  "Opened a page only subscribers can see",
];

// the plan in one line: what it costs, and the trial in front of it
const summary = ({ subscription: s, inTrial }: MySubscription) => {
  const recurring = `${formatTestPi(BigInt(s.price))} ${describePeriod(Number(s.period_secs)).every}`;
  if (!inTrial) {
    return recurring;
  }
  const trial = `Free for ${describePeriod(Number(s.trial_period_secs)).span}`;
  return s.auto_renew ? `${trial}, then ${recurring}` : trial;
};

const billingRows = ({ subscription: s, inTrial }: MySubscription): InfoRow[] => {
  const rows: InfoRow[] = [["Started", chainDate(s.created_at)]];
  if (inTrial) {
    rows.push([s.auto_renew ? "Free until" : "Ends", chainDate(s.trial_end_ts)]);
  }
  if (s.auto_renew) {
    rows.push(["Next charge due", chainDate(s.next_charge_ts), formatTestPi(BigInt(s.price))]);
  } else if (!inTrial) {
    rows.push(["Ends", chainDate(s.service_end_ts)]);
  }
  rows.push(["Auto-renew", s.auto_renew ? "On" : "Off"]);
  return rows;
};

const walletRows = ({ subscription: s, inTrial }: MySubscription): InfoRow[] => {
  const rows: InfoRow[] = [["Paid from", "Your wallet", shortAddress(s.subscriber)]];
  // a trial that does not renew pays nobody
  if (!inTrial || s.auto_renew) {
    rows.push(["Paid to", "Pi Bakery", shortAddress(APP_WALLET_ADDRESS)]);
  }
  return rows;
};

// what an active subscriber sees on /club, from the contract's own record of the subscription
const ClubDetails = ({ mine }: { mine: MySubscription }) => (
  <>
    <SectionLabel>Your subscription</SectionLabel>
    <PlanRow>
      <Box flex={1}>
        <Typography fontWeight={600}>{mine.plan.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {summary(mine)}
        </Typography>
      </Box>
      <Chip size="small" color="primary" label="Active" />
    </PlanRow>
    <SectionLabel>Billing</SectionLabel>
    <InfoRows rows={billingRows(mine)} />
    <SectionLabel>Wallets</SectionLabel>
    <InfoRows rows={walletRows(mine)} />

    <SectionLabel>What you tested</SectionLabel>
    <List dense disablePadding>
      {STEPS.map(step => (
        <ListItem key={step} disableGutters>
          <StepIcon>
            <CheckCircleIcon color="primary" />
          </StepIcon>
          {step}
        </ListItem>
      ))}
    </List>
  </>
);

export default ClubDetails;
