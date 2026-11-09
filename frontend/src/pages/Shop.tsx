import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import SignIn from "../components/SignIn";
import SubscriptionCard from "../components/SubscriptionCard";
import SubscriptionSection from "../components/subscription/SubscriptionSection";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useClub } from "../hooks/useClubSubscription";
import { IRRA_TOKEN_CANONICAL, usePayments } from "../hooks/usePayments";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { sendTestNotification } from "../utils/sendTestNotification";

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Subscribe on the club page comes here with the plan sheet open, on a given plan for Resubscribe
  const request = location.state as { openPlans?: boolean; serviceId?: string } | null;
  const openPlans = request?.openPlans === true;
  const openPlansOn = request?.serviceId ?? null;

  // the request lives in this history entry: drop it once read, so a reload or a back press does not reopen the sheet
  useEffect(() => {
    if (openPlans) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [openPlans, navigate, location.pathname]);

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
    result: subscriptionResult,
    isLoading: isSubscriptionLoading,
  } = useSubscriptions({
    isAuthenticated,
    onRequireAuth: requireAuth,
  });

  const club = useClub();

  return (
    <>
      <Header
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onSendTestNotification={() => sendTestNotification(user)}
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

      {user && club.enabled && (
        <SubscriptionSection
          onOpenClub={() => navigate("/club")}
          openOnMount={openPlans ? { serviceId: openPlansOn } : null}
          developerTools={
            user.roles.includes("core_team") && (
              <SubscriptionCard
                onClickSubscribe={subscribe}
                onClickProcess={processSubscriptions}
                result={subscriptionResult}
                disabled={isSubscriptionLoading}
              />
            )
          }
        />
      )}

      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} disabled={isAuthLoading} />}
    </>
  );
};

export default Shop;
