import Header from "../components/Header";
import SignIn from "../components/SignIn";
import SubscriptionPanel from "../components/SubscriptionPanel";

import { useAuth } from "../hooks/useAuth";
import { axiosClient } from "../lib/axiosClient.ts";

const Shop = () => {
  const {
    user,
    showSignIn,
    signIn,
    signOut,
    closeSignIn,
    isLoading: isAuthLoading,
  } = useAuth();

  const onSendTestNotification = () => {
    const notification = {
      title: "Test Notification",
      body: "This is a test notification",
      user_uid: user?.uid,
      subroute: "/shop",
    };
    axiosClient.post("/notifications/send", { notifications: [notification] });
  };

  return (
    <>
      <Header
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onSendTestNotification={onSendTestNotification}
        isLoading={isAuthLoading}
      />

      <SubscriptionPanel />

      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} disabled={isAuthLoading} />}
    </>
  );
};

export default Shop;
