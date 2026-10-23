import { createContext, useCallback, useContext, useState } from "react";
import { axiosClient } from "../lib/axiosClient";
import type { AuthResult, PaymentDTO, User } from "../types/pi";
import { isSubscriptionEnabledFor } from "../utils/subscriptionAudience";

export const SIGN_IN_SCOPES = ["username", "payments", "roles", "in_app_notifications"];
export const WALLET_SCOPE = "wallet_address";

// The platform compares the requested scopes with the granted ones as an exact set, so a sign-in that asks for
// less than the club was granted shows the consent screen again (pi back, apps_controller#check_previous_scopes).
// Once the club has been granted the wallet scope on this device, sign-ins keep asking for it. Kept per device,
// since the user is not known before signing in: on a shared device the next person is asked for it too.
const WALLET_GRANTED_KEY = "club_wallet_scope_granted";

// outside the club's audience nobody is asked for the wallet again on this device (this one sign-in already was)
const forgetWalletGrant = () => {
  try {
    localStorage.removeItem(WALLET_GRANTED_KEY);
  } catch {
    // storage unavailable: nothing was remembered either
  }
};

export const rememberWalletGrant = () => {
  try {
    localStorage.setItem(WALLET_GRANTED_KEY, "1");
  } catch {
    // storage unavailable: the next sign-in shows the consent screen once more
  }
};

const signInScopes = () => {
  try {
    return localStorage.getItem(WALLET_GRANTED_KEY) === "1" ? [...SIGN_IN_SCOPES, WALLET_SCOPE] : SIGN_IN_SCOPES;
  } catch {
    return SIGN_IN_SCOPES;
  }
};

// every authenticate call replaces the SDK's handler, so all of them must pass this one
export const onIncompletePaymentFound = async (payment: PaymentDTO) => {
  try {
    await axiosClient.post("/payments/incomplete", { payment });
  } catch (err) {
    console.error("Error handling incomplete payment:", err);
  }
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  // changes on every sign-in and sign-out, so per-user state can tell one session from the next
  const [sessionId, setSessionId] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signInUser = useCallback(async (authResult: AuthResult) => {
    try {
      await axiosClient.post("/user/signin", { authResult });
      if (!isSubscriptionEnabledFor(authResult.user)) {
        forgetWalletGrant();
      }
      setUser(authResult.user);
      setSessionId(id => id + 1);
      setShowSignIn(false);
    } catch (err) {
      console.error("Error signing in:", err);
    }
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const authResult = await window.Pi.authenticate(signInScopes(), onIncompletePaymentFound);
      await signInUser(authResult);
    } catch (err) {
      console.error("Error authenticating:", err);
    } finally {
      setIsLoading(false);
    }
  }, [signInUser]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await axiosClient.get("/user/signout");
      setUser(null);
      setSessionId(id => id + 1);
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeSignIn = useCallback(() => {
    setShowSignIn(false);
  }, []);

  return {
    user,
    sessionId,
    isAuthenticated: Boolean(user),
    showSignIn,
    signIn,
    signOut,
    closeSignIn,
    requireAuth: () => setShowSignIn(true),
    isLoading,
  };
};

// the signed-in user is shared by every page, so it survives moving between the shop and the club page
export const AuthContext = createContext<ReturnType<typeof useAuthState> | null>(null);

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return auth;
};
