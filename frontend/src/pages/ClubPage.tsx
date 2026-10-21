import styled from "styled-components";
import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignIn from "../components/SignIn";
import {
  ActiveRow,
  ClubText,
  club,
  Cta,
  Ghost,
  Note,
  Pill,
  ResultBody,
  ResultIcon,
  ResultTitle,
  Rows,
  Spinner,
  Stack,
} from "../components/subscription/styles";
import { useAuth } from "../hooks/useAuth";
import { planToResubscribe, useClub, type MySubscription } from "../hooks/useClubSubscription";
import FailureNote from "../components/subscription/FailureNote";
import { APP_WALLET_ADDRESS } from "../hooks/useSubscriptions";
import { describePeriod, formatDate, formatPi, fromChainTime, shortAddress } from "../utils/subscription";
import { sendTestNotification } from "../utils/sendTestNotification";

// Pi Bakery Club: a page only users with an active subscription can open. The wallet checked is the signed-in
// user's own, read from the SDK, and whether its subscription is active comes from the subscription contract
// (is_subscription_active), never from what this app remembers.

const Page = styled(ClubText).attrs({ as: "main" })`
  padding: 28px 16px 40px;
`;

const Label = styled.p`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${club.ink3};
  margin: 22px 2px 8px;
`;

const SubLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${club.ink3};
  margin: 14px 2px 6px;
`;

const Steps = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;

  li {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 15px;
  }
`;

const Tick = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${club.accent};
  color: ${club.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Card = ({ label, rows }: { label: string; rows: [string, string, string?][] }) => (
  <>
    <SubLabel>{label}</SubLabel>
    <Rows>
      {rows.map(([key, value, small]) => (
        <div key={key}>
          <span>{key}</span>
          <b>
            {value}
            {small && <small>{small}</small>}
          </b>
        </div>
      ))}
    </Rows>
  </>
);

const Unlocked = ({ mine }: { mine: MySubscription }) => {
  const { plan, subscription } = mine;
  const price = formatPi(BigInt(subscription.price));
  const period = describePeriod(Number(subscription.period_secs));
  const trial = describePeriod(Number(subscription.trial_period_secs));
  const { inTrial } = mine;
  const date = (timestamp: string) => formatDate(fromChainTime(timestamp));

  const billing: [string, string, string?][] = [
    ["Started", date(subscription.created_at)],
    ...(inTrial
      ? [[subscription.auto_renew ? "Free until" : "Ends", date(subscription.trial_end_ts)] as [string, string]]
      : []),
    ...(subscription.auto_renew
      ? [["Next charge due", date(subscription.next_charge_ts), `${price} Test-Pi`] as [string, string, string]]
      : inTrial
        ? []
        : [["Ends", date(subscription.service_end_ts)] as [string, string]]),
    ["Auto-renew", subscription.auto_renew ? "On" : "Off"],
  ];
  // a trial that does not renew pays nobody
  const wallets: [string, string, string?][] = [
    ["Paid from", "Your wallet", shortAddress(subscription.subscriber)],
    ...(inTrial && !subscription.auto_renew
      ? []
      : [
          ["Paid to", "Pi Bakery", APP_WALLET_ADDRESS ? shortAddress(APP_WALLET_ADDRESS) : undefined] as [
            string,
            string,
            string?,
          ],
        ]),
  ];

  return (
    <>
      <ResultIcon $tone="ok">
        <CheckIcon />
      </ResultIcon>
      <ResultTitle as="h1">You've unlocked Pi Bakery Club</ResultTitle>
      <ResultBody>
        You successfully tested the subscription feature on the demo app. Only pioneers with an active plan can open
        this page.
      </ResultBody>

      <Label>Your subscription</Label>
      <ActiveRow style={{ marginBottom: 8 }}>
        <div>
          {plan.name}
          <small>
            {inTrial
              ? subscription.auto_renew
                ? `Free for ${trial.span}, then ${price} Test-Pi ${period.every}`
                : `Free for ${trial.span}`
              : `${price} Test-Pi ${period.every}`}
          </small>
        </div>
        <Pill>Active</Pill>
      </ActiveRow>
      <Card label="Billing" rows={billing} />
      <Card label="Wallets" rows={wallets} />

      <Label>What you tested</Label>
      <Steps>
        {[
          "Picked a plan in the app",
          "Reviewed and approved it in your Pi Wallet",
          "Confirmed on Pi Testnet",
          "Opened a page only subscribers can see",
        ].map(step => (
          <li key={step}>
            <Tick>
              <CheckIcon />
            </Tick>
            {step}
          </li>
        ))}
      </Steps>
    </>
  );
};

const ClubPage = () => {
  const navigate = useNavigate();
  const { user, showSignIn, signIn, signOut, closeSignIn, isLoading: isAuthLoading } = useAuth();
  const { enabled, plans, status, retry } = useClub();

  const backToShop = () => navigate("/");
  // the plan sheet lives on the shop page
  const subscribe = (serviceId?: string) => navigate("/", { state: { openPlans: true, serviceId } });

  const locked = (body: string, action?: { label: string; onClick: () => void }) => (
    <>
      <ResultIcon $tone="lock">
        <LockOutlinedIcon />
      </ResultIcon>
      <ResultTitle as="h1">This page is for subscribers</ResultTitle>
      <ResultBody>{body}</ResultBody>
      <Stack>
        {action && <Cta onClick={action.onClick}>{action.label}</Cta>}
        <Ghost onClick={backToShop}>Back to shop</Ghost>
      </Stack>
    </>
  );

  let content;
  if (!user) {
    content = locked("Sign in, then subscribe to Pi Bakery Club to open it.", { label: "Sign in", onClick: signIn });
  } else if (!enabled) {
    // the club is switched on for core_team only (SUBSCRIPTION_AUDIENCE), and this user is not in it
    content = locked("Pi Bakery Club isn't available for your account yet.");
  } else if (status.status === "loading") {
    content = (
      <Note role="status">
        <Spinner aria-hidden="true" />
        Checking your subscription…
      </Note>
    );
  } else if (status.status === "error") {
    content = (
      <>
        <FailureNote failure={status} onRetry={retry} />
        <Ghost onClick={backToShop}>Back to shop</Ghost>
      </>
    );
  } else if (status.value?.active) {
    content = (
      <>
        <Unlocked mine={status.value} />
        <Stack style={{ marginTop: 16 }}>
          <Ghost onClick={backToShop}>Back to shop</Ghost>
        </Stack>
      </>
    );
  } else if (status.value) {
    const end = status.value.subscription.service_end_ts;
    const ended = status.value.hasEnded ? `ended ${formatDate(fromChainTime(end))}` : "is no longer active";
    const again = planToResubscribe(plans, status.value);
    content = locked(`Your ${status.value.plan.name} plan ${ended}. Resubscribe to open Pi Bakery Club again.`, {
      label: "Resubscribe",
      onClick: () => subscribe(again?.serviceId),
    });
  } else {
    content = locked("Subscribe to Pi Bakery Club to open it.", { label: "Subscribe", onClick: () => subscribe() });
  }

  return (
    <>
      <Header
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onSendTestNotification={() => sendTestNotification(user)}
        isLoading={isAuthLoading}
      />
      <Page aria-label="Pi Bakery Club">{content}</Page>
      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} disabled={isAuthLoading} />}
    </>
  );
};

export default ClubPage;
