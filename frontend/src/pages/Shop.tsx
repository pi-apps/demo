import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import SignIn from "../components/SignIn";
import SubscriptionCard from "../components/SubscriptionCard";

import { useAuth } from "../hooks/useAuth";
import { IRRA_TOKEN_CANONICAL, usePayments } from "../hooks/usePayments";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { axiosClient } from "../lib/axiosClient.ts";

const Shop = () => {
  const {
    user,
    isAuthenticated,
    showSignIn,
    signIn,
    signOut,
    closeSignIn,
    requireAuth,
    isLoading: isAuthLoading,
  } = useAuth();

  const { orderProduct, isLoading } = usePayments({
    isAuthenticated,
    onRequireAuth: requireAuth,
  });

  const {
    subscribe,
    processSubscriptions,
    isLoading: isSubscriptionLoading,
  } = useSubscriptions({
    isAuthenticated,
    onRequireAuth: requireAuth,
  });

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

      <ProductCard
        name="Apple Pie"
        description="You know what this is. Pie. Apples. Apple pie."
        price={0.1}
        pictureURL="https://upload.wikimedia.org/wikipedia/commons/4/4b/Apple_pie.jpg"
        onClickBuyWithPi={() => orderProduct("Order Apple Pie", 0.1, { productId: "apple_pie_1" })}
        onClickBuyWithIrra={() =>
          orderProduct("Order Apple Pie", 0.1, { productId: "apple_pie_1" }, IRRA_TOKEN_CANONICAL)
        }
        disabled={isLoading}
      />

      <ProductCard
        name="Lemon Meringue Pie"
        description="Order at your own risk."
        price={0.2}
        pictureURL="https://live.staticflickr.com/1156/5134246283_f2686ff8a8_b.jpg"
        onClickBuyWithPi={() =>
          orderProduct("Order Lemon Meringue Pie", 0.2, { productId: "lemon_pie_1" })
        }
        onClickBuyWithIrra={() =>
          orderProduct("Order Lemon Meringue Pie", 0.2, { productId: "lemon_pie_1" }, IRRA_TOKEN_CANONICAL)
        }
        disabled={isLoading}
      />

      {user?.roles.includes("core_team") && (
        <SubscriptionCard
          onClickSubscribe={subscribe}
          onClickProcess={processSubscriptions}
          disabled={isSubscriptionLoading}
        />
      )}

      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} disabled={isAuthLoading} />}
    </>
  );
};

export default Shop;
