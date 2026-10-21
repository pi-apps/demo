import type { ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignIn from "../components/SignIn";
import ClubDetails from "../components/subscription/ClubDetails";
import { ResultIcon } from "../components/subscription/club.styles";
import { clubTheme } from "../components/subscription/clubTheme";
import FailureNote from "../components/subscription/FailureNote";
import { planToResubscribe } from "../hooks/club/plans";
import { useAuth } from "../hooks/useAuth";
import { useClub } from "../hooks/useClubSubscription";
import { formatDate, fromChainTime } from "../utils/subscription";
import { sendTestNotification } from "../utils/sendTestNotification";

// Pi Bakery Club: a page only users with an active subscription can open. The wallet checked is the signed-in
// user's own, read from the SDK, and whether its subscription is active comes from the subscription contract
// (is_subscription_active), never from what this app remembers.
const ClubPage = () => {
  const navigate = useNavigate();
  const { user, showSignIn, signIn, signOut, closeSignIn, isLoading: isAuthLoading } = useAuth();
  const { enabled, plans, status, retry } = useClub();
  const backToShop = <Button onClick={() => navigate("/")}>Back to shop</Button>;
  // the plan sheet lives on the shop page
  const subscribe = (serviceId?: string) => navigate("/", { state: { openPlans: true, serviceId } });

  // an icon, a heading and a line, then whatever the screen offers below them
  const screen = (icon: ReactNode, title: string, body: string, below: ReactNode) => (
    <>
      {icon}
      <Typography variant="h5" component="h1" align="center" fontWeight={700}>
        {title}
      </Typography>
      <Typography align="center" color="text.secondary" mb={2}>
        {body}
      </Typography>
      {below}
    </>
  );
  const lock = (
    <ResultIcon tone="lock">
      <LockOutlinedIcon />
    </ResultIcon>
  );
  const locked = (body: string, label?: string, onClick?: () => void) =>
    screen(
      lock,
      "This page is for subscribers",
      body,
      <Stack gap={1}>
        {label && (
          <Button variant="contained" size="large" onClick={onClick}>
            {label}
          </Button>
        )}
        {backToShop}
      </Stack>
    );

  let content: ReactNode;
  if (!user) {
    content = locked("Sign in, then subscribe to Pi Bakery Club to open it.", "Sign in", signIn);
  } else if (!enabled) {
    // the club is switched on for core_team only (SUBSCRIPTION_AUDIENCE), and this user is not in it
    content = locked("Pi Bakery Club isn't available for your account yet.");
  } else if (status.status === "loading") {
    content = (
      <Alert severity="info" icon={<CircularProgress size={18} aria-hidden="true" />} role="status">
        Checking your subscription…
      </Alert>
    );
  } else if (status.status === "error") {
    content = (
      <Stack gap={1}>
        <FailureNote failure={status} onRetry={retry} />
        {backToShop}
      </Stack>
    );
  } else if (status.value?.active) {
    content = (
      <>
        {screen(
          <ResultIcon tone="ok">
            <CheckIcon />
          </ResultIcon>,
          "You've unlocked Pi Bakery Club",
          "You successfully tested the subscription feature on the demo app. Only pioneers with an active plan can open this page.",
          <>
            <ClubDetails mine={status.value} />
            <Box mt={2}>{backToShop}</Box>
          </>
        )}
      </>
    );
  } else if (status.value) {
    const { hasEnded, plan, subscription } = status.value;
    const ended = hasEnded ? `ended ${formatDate(fromChainTime(subscription.service_end_ts))}` : "is no longer active";
    const again = planToResubscribe(plans, status.value);
    content = locked(`Your ${plan.name} plan ${ended}. Resubscribe to open Pi Bakery Club again.`, "Resubscribe", () =>
      subscribe(again?.serviceId)
    );
  } else {
    content = locked("Subscribe to Pi Bakery Club to open it.", "Subscribe", () => subscribe());
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
      <ThemeProvider theme={clubTheme}>
        <Box
          component="main"
          aria-label="Pi Bakery Club"
          px={2}
          pt={3.5}
          pb={5}
          fontFamily={clubTheme.typography.fontFamily}
        >
          {content}
        </Box>
      </ThemeProvider>
      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} disabled={isAuthLoading} />}
    </>
  );
};

export default ClubPage;
