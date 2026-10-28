import { useLayoutEffect, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignIn from "../components/SignIn";
import ClubDetails from "../components/subscription/ClubDetails";
import { ClubScreen, LockedScreen } from "../components/subscription/ClubScreen";
import { ClubMain, ResultIcon } from "../components/subscription/club.styles";
import { clubTheme } from "../components/subscription/clubTheme";
import FailureNote from "../components/subscription/FailureNote";
import Progress from "../components/subscription/Progress";
import { awaitsRenewal, planToResubscribe } from "../hooks/club/plans";
import { useAuth } from "../hooks/useAuth";
import { useClub } from "../hooks/useClubSubscription";
import { chainDate } from "../utils/subscription";
import { sendTestNotification } from "../utils/sendTestNotification";

// Pi Bakery Club: a page only users with an active subscription can open. The wallet checked is the signed-in
// user's own, read from the SDK, and whether its subscription is active comes from the subscription contract
// (is_subscription_active), never from what this app remembers.
const ClubPage = () => {
  const navigate = useNavigate();
  const { user, showSignIn, signIn, signOut, closeSignIn, isLoading: isAuthLoading } = useAuth();
  const { enabled, plans, status, retry, refresh } = useClub();
  // The status may have been read a while ago (on the shop, or before going back and forth), so the page reads it
  // again on every visit. Before paint, so a stale "active" is never shown.
  useLayoutEffect(refresh, [refresh]);
  const backToShop = () => navigate("/");
  // the plan sheet lives on the shop page
  const subscribe = (serviceId?: string) => navigate("/", { state: { openPlans: true, serviceId } });

  let content: ReactNode;
  if (!user) {
    content = (
      <LockedScreen
        body="Sign in, then subscribe to Pi Bakery Club to open it."
        action={{ label: "Sign in", onClick: signIn }}
        onBack={backToShop}
      />
    );
  } else if (!enabled) {
    // the club is open to core_team only for now (see canUseClub)
    content = <LockedScreen body="Pi Bakery Club isn't available for your account yet." onBack={backToShop} />;
  } else if (status.status === "loading") {
    content = <Progress>Checking your subscription…</Progress>;
  } else if (status.status === "error") {
    content = (
      <Stack gap={1}>
        <FailureNote failure={status} onRetry={retry} />
        <Button onClick={backToShop}>Back to shop</Button>
      </Stack>
    );
  } else if (status.value?.active) {
    content = (
      <ClubScreen
        icon={
          <ResultIcon tone="ok">
            <CheckIcon />
          </ResultIcon>
        }
        title="You've unlocked Pi Bakery Club"
        body="You successfully tested the subscription feature on the demo app. Only pioneers with an active plan can open this page."
      >
        <ClubDetails mine={status.value} />
        <Box mt={2}>
          <Button onClick={backToShop}>Back to shop</Button>
        </Box>
      </ClubScreen>
    );
  } else if (status.value && awaitsRenewal(status.value)) {
    const { plan, subscription } = status.value;
    content = (
      <LockedScreen
        body={`Your ${plan.name} plan ran out ${chainDate(subscription.service_end_ts)} with auto-renew on. Pi Bakery Club opens again once Pi Bakery charges the renewal when it runs billing.`}
        action={{ label: "Check again", onClick: refresh }}
        onBack={backToShop}
      />
    );
  } else if (status.value) {
    const { hasEnded, plan, subscription } = status.value;
    const ended = hasEnded ? `ended ${chainDate(subscription.service_end_ts)}` : "is no longer active";
    const again = planToResubscribe(plans, status.value);
    content = (
      <LockedScreen
        body={`Your ${plan.name} plan ${ended}. Resubscribe to open Pi Bakery Club again.`}
        action={{ label: "Resubscribe", onClick: () => subscribe(again?.serviceId) }}
        onBack={backToShop}
      />
    );
  } else {
    content = (
      <LockedScreen
        body="Subscribe to Pi Bakery Club to open it."
        action={{ label: "Subscribe", onClick: () => subscribe() }}
        onBack={backToShop}
      />
    );
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
        <ClubMain aria-label="Pi Bakery Club">{content}</ClubMain>
      </ThemeProvider>
      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} disabled={isAuthLoading} />}
    </>
  );
};

export default ClubPage;
