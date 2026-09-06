import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import SignIn from "../components/SignIn";

import { useAuth } from "../hooks/useAuth";
import { IRRA_TOKEN_CANONICAL, usePayments } from "../hooks/usePayments";
import { axiosClient } from "../lib/axiosClient.ts";
import { useCallback, useEffect, useState } from "react";

const Shop = () => {
  const [hasPurchasedKit, setHasPurchasedKit] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  // MOBILE_SAVE_FLOW
  const [kitFile, setKitFile] = useState<File | null>(null);
  const [kitURL, setKitURL] = useState("");
  useEffect(() => {
    if (!kitFile) { setKitURL(""); return; }
    const url = URL.createObjectURL(kitFile);
    setKitURL(url);
    return () => URL.revokeObjectURL(url);
  }, [kitFile]);
  const downloadKit = async () => {
    setIsDownloading(true);
    setDownloadError("");
    setKitFile(null);
    try {
      const response = await axiosClient.get("/payments/kit-download", { responseType: "blob" });
      setKitFile(new File([response.data], "AI_Productivity_Starter_Kit.zip", { type: "application/zip" }));
    } catch {
      setDownloadError("Could not retrieve your files. Please sign in again and retry. You do not need to pay again.");
    } finally {
      setIsDownloading(false);
    }
  };
  const saveKit = async () => {
    if (!kitFile) return;
    setDownloadError("");
    try {
      await navigator.share({ files: [kitFile], title: "AI Productivity Starter Kit" });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setDownloadError("This browser could not open the sharing menu. Try the Save ZIP link below.");
    }
  };
  const [accessError, setAccessError] = useState("");
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

  const checkPurchase = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axiosClient.get("/payments/kit-access");
      setHasPurchasedKit(data.hasAccess === true);
      setAccessError(data.hasAccess ? "" : "No completed kit purchase found for this account.");
    } catch {
      setAccessError("Purchase lookup is unavailable. Check that the updated backend is running, then try again.");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setKitFile(null);
    setHasPurchasedKit(false);
    setAccessError("");
    if (isAuthenticated) void checkPurchase();
  }, [isAuthenticated, checkPurchase]);

  const { orderProduct, isLoading } = usePayments({
    isAuthenticated,
    onRequireAuth: requireAuth,
    onPaymentComplete: () => { void checkPurchase(); },
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
  name="AI Productivity Starter Kit"
  description="A practical toolkit for office workers: a quick-start guide, 20 reusable AI prompts, an editable weekly planner, and three worked examples."
  price={0.1}
  pictureURL="/ai-productivity-kit.svg"
  onClickBuyWithPi={() =>
    orderProduct("Order AI Productivity Starter Kit", 0.1, {
      productId: "ai_productivity_starter_kit_1",
    })
  }
  onClickBuyWithIrra={() =>
    orderProduct(
      "Order AI Productivity Starter Kit",
      0.1,
      { productId: "ai_productivity_starter_kit_1" },
      IRRA_TOKEN_CANONICAL
    )
  }
  disabled={isLoading}
      />

      {isAuthenticated && !hasPurchasedKit && (
        <div style={{ margin: 16 }}>
          <button type="button" onClick={() => { void checkPurchase(); }}>Restore my purchase</button>
          {accessError && <p role="status">{accessError}</p>}
        </div>
      )}
      {isAuthenticated && hasPurchasedKit && (
        <div style={{ margin: 16, padding: 16, border: "1px solid #5eead4", borderRadius: 8 }}>
          <strong>Your starter kit is ready.</strong>
          <p>Download the files included with your verified Test-Pi purchase.</p>
          <button type="button" disabled={isDownloading} onClick={() => { void downloadKit(); }}>
            {isDownloading ? "Preparing download…" : "Download AI Productivity Starter Kit"}
          </button>
          {kitFile && kitURL && (
            <div role="status">
              <p>Your ZIP is ready. Use a save option below.</p>
              {navigator.canShare?.({ files: [kitFile] }) && (
                <>
                  <button type="button" onClick={() => { void saveKit(); }}>Save or share files</button>
                  <p>On iPhone, choose Save to Files from the sharing menu.</p>
                </>
              )}
              <a href={kitURL} download="AI_Productivity_Starter_Kit.zip">Save ZIP</a>
            </div>
          )}
          {downloadError && <p role="alert">{downloadError}</p>}
        </div>
      )}


      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} disabled={isAuthLoading} />}
    </>
  );
};

export default Shop;
