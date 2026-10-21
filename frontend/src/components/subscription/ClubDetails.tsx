import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { MySubscription } from "../../hooks/club/plans";
import { APP_WALLET_ADDRESS } from "../../hooks/useSubscriptions";
import { describePeriod, formatDate, formatPi, fromChainTime, shortAddress } from "../../utils/subscription";
import { PlanRow } from "./club.styles";
import { SectionLabel, StepIcon } from "./ClubDetails.styles";
import InfoRows, { type InfoRow as Row } from "./InfoRows";

const STEPS = [
  "Picked a plan in the app",
  "Reviewed and approved it in your Pi Wallet",
  "Confirmed on Pi Testnet",
  "Opened a page only subscribers can see",
];

// what an active subscriber sees on /club, from the contract's own record of the subscription
const ClubDetails = ({ mine }: { mine: MySubscription }) => {
  const { plan, subscription: s, inTrial } = mine;
  const amount = `${formatPi(BigInt(s.price))} Test-Pi`;
  const period = describePeriod(Number(s.period_secs));
  const trial = describePeriod(Number(s.trial_period_secs));
  const date = (timestamp: string) => formatDate(fromChainTime(timestamp));

  const billing: Row[] = [
    ["Started", date(s.created_at)],
    ...(inTrial ? [[s.auto_renew ? "Free until" : "Ends", date(s.trial_end_ts)] as Row] : []),
    ...(s.auto_renew ? [["Next charge due", date(s.next_charge_ts), amount] as Row] : []),
    ...(!s.auto_renew && !inTrial ? [["Ends", date(s.service_end_ts)] as Row] : []),
    ["Auto-renew", s.auto_renew ? "On" : "Off"],
  ];
  // a trial that does not renew pays nobody
  const wallets: Row[] = [
    ["Paid from", "Your wallet", shortAddress(s.subscriber)],
    ...(inTrial && !s.auto_renew
      ? []
      : [["Paid to", "Pi Bakery", APP_WALLET_ADDRESS ? shortAddress(APP_WALLET_ADDRESS) : undefined] as Row]),
  ];
  const summary = inTrial
    ? s.auto_renew
      ? `Free for ${trial.span}, then ${amount} ${period.every}`
      : `Free for ${trial.span}`
    : `${amount} ${period.every}`;

  return (
    <>
      <SectionLabel>Your subscription</SectionLabel>
      <PlanRow>
        <Box flex={1}>
          <Typography fontWeight={600}>{plan.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {summary}
          </Typography>
        </Box>
        <Chip size="small" color="primary" label="Active" />
      </PlanRow>
      <SectionLabel>Billing</SectionLabel>
      <InfoRows rows={billing} />
      <SectionLabel>Wallets</SectionLabel>
      <InfoRows rows={wallets} />

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
};

export default ClubDetails;
