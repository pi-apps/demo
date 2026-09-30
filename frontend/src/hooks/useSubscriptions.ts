import { scValToNative } from "@stellar/stellar-base";
import { useCallback, useState } from "react";

type UseSubscriptionsArgs = {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
};

export type SubscriptionResult = {
  message: string;
  transaction?: unknown;
  updatedData?: unknown;
  error?: string;
};

// the app wallet is the merchant of the app's subscription services
const APP_WALLET_ADDRESS = import.meta.env.VITE_APP_WALLET_ADDRESS;

// how long we wait for a submitted transaction to land on the chain
const MAX_WAIT_SECONDS = 90;

// a submitted transaction is only "PENDING", poll until it lands (or fails) on the chain
const waitForTransaction = async (hash: string, onSecondPassed: (seconds: number) => void) => {
  for (let seconds = 1; seconds <= MAX_WAIT_SECONDS; seconds++) {
    // with 2 attempts, pollTransaction checks the transaction once and waits a second if it hasn't landed yet
    const { status, ledger, returnValue } = await window.Pi.SmartContract.pollTransaction(hash, 2);

    if (status !== "NOT_FOUND") {
      // returnValue is what the contract call returned, encoded as XDR - decode it into a plain object
      const result = returnValue ? scValToNative(returnValue) : undefined;
      return { hash, status, ledger, result };
    }

    onSecondPassed(seconds);
  }

  return { hash, status: "NOT_FOUND" };
};

const waitingMessage = (seconds: number) =>
  `Waiting for the transaction to land... ${seconds}s (up to ${MAX_WAIT_SECONDS}s)`;

export const useSubscriptions = ({ isAuthenticated, onRequireAuth }: UseSubscriptionsArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SubscriptionResult | null>(null);

  // the user subscribes to a service from their own wallet (the address typed in the form)
  const subscribe = useCallback(
    async (userWalletAddress: string, serviceId: string, periods: string) => {
      if (!isAuthenticated) {
        onRequireAuth();
        return;
      }

      setIsLoading(true);
      setResult({ message: "Subscribing..." });
      try {
        const submitted = await window.Pi.SmartContract.Subscription.subscribe(
          userWalletAddress,
          serviceId,
          true,
          periods
        );

        setResult({ message: waitingMessage(0) });
        const transaction = await waitForTransaction(submitted.hash, seconds =>
          setResult({ message: waitingMessage(seconds) })
        );
        if (transaction.status !== "SUCCESS") {
          setResult({ message: `Subscription failed (${transaction.status})`, transaction });
          return;
        }

        // subscribe returns the new subscription, read it back from the contract by its id
        const subscriptionId = transaction.result.sub_id.toString();
        const updatedData = await window.Pi.SmartContract.Subscription.getSubscription(
          userWalletAddress,
          subscriptionId
        );
        setResult({ message: "Subscribed!", transaction, updatedData });
      } catch (err) {
        console.error("Error subscribing:", err);
        setResult({ message: "Subscription failed", error: String(err) });
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
      setResult({ message: "Processing subscriptions..." });
      try {
        const submitted = await window.Pi.SmartContract.Subscription.process(
          APP_WALLET_ADDRESS,
          serviceId,
          offset,
          limit
        );

        setResult({ message: waitingMessage(0) });
        const transaction = await waitForTransaction(submitted.hash, seconds =>
          setResult({ message: waitingMessage(seconds) })
        );
        if (transaction.status !== "SUCCESS") {
          setResult({ message: `Processing failed (${transaction.status})`, transaction });
          return;
        }

        // read the service's subscriptions again to show the charged ones
        const updatedData = await window.Pi.SmartContract.Subscription.getMerchantSubscriptions(
          APP_WALLET_ADDRESS,
          serviceId
        );
        setResult({ message: "Subscriptions processed!", transaction, updatedData });
      } catch (err) {
        console.error("Error processing subscriptions:", err);
        setResult({ message: "Processing failed", error: String(err) });
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, onRequireAuth]
  );

  return {
    subscribe,
    processSubscriptions,
    result,
    isLoading,
  };
};
