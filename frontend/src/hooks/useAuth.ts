import { useCallback, useState } from "react";
import { axiosClient } from "../lib/axiosClient";
import type { AuthResult, PaymentDTO, User } from "../types/pi";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onIncompletePaymentFound = useCallback(async (payment: PaymentDTO) => {
    try {
      await axiosClient.post("/payments/incomplete", { payment });
    } catch (err) {
      console.error("Error handling incomplete payment:", err);
    }
  }, []);

  const signInUser = useCallback(async (authResult: AuthResult) => {
    try {
      await axiosClient.post("/user/signin", { authResult });
      setUser(authResult.user);
      setShowSignIn(false);
    } catch (err) {
      console.error("Error signing in:", err);
    }
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const scopes = ["username", "payments", "roles", "in_app_notifications"];
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      await signInUser(authResult);
    } catch (err) {
      console.error("Error authenticating:", err);
    } finally {
      setIsLoading(false);
    }
  }, [onIncompletePaymentFound, signInUser]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await axiosClient.get("/user/signout");
      setUser(null);
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
    isAuthenticated: Boolean(user),
    showSignIn,
    signIn,
    signOut,
    closeSignIn,
    requireAuth: () => setShowSignIn(true),
    isLoading,
  };
};
