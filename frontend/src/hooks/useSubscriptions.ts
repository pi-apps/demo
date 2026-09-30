import { useCallback, useState } from "react";
import { axiosClient } from "../lib/axiosClient";

type UseSubscriptionsArgs = {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
};

export const useSubscriptions = ({ isAuthenticated, onRequireAuth }: UseSubscriptionsArgs) => {
  const [isLoading, setIsLoading] = useState(false);

  // the user subscribes to a service from their own wallet
  const subscribe = useCallback(
    async (serviceId: string, periods: string) => {
      if (!isAuthenticated) {
        onRequireAuth();
        return;
      }

      setIsLoading(true);
      try {
        const { wallets } = await window.Pi.Wallet.getUserWalletAddresses();
        const userWalletAddress = wallets[0].publicKey;

        const result = await window.Pi.SmartContract.Subscription.subscribe(
          userWalletAddress,
          serviceId,
          true,
          periods
        );
        console.log("Subscribed:", result);
      } catch (err) {
        console.error("Error subscribing:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, onRequireAuth]
  );

  // the app charges the subscribers of its service, from the app wallet
  const processSubscriptions = useCallback(
    async (serviceId: string, offset: number, limit: number) => {
      if (!isAuthenticated) {
        onRequireAuth();
        return;
      }

      setIsLoading(true);
      try {
        const response = await axiosClient.get("/subscriptions/app_wallet");
        const appWalletAddress = response.data.address;

        const result = await window.Pi.SmartContract.Subscription.process(appWalletAddress, serviceId, offset, limit);
        console.log("Processed subscriptions:", result);
      } catch (err) {
        console.error("Error processing subscriptions:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, onRequireAuth]
  );

  return {
    subscribe,
    processSubscriptions,
    isLoading,
  };
};
