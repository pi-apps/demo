import type { xdr } from "@stellar/stellar-base";
import { AuthResult, ContractSubscription, PaymentDTO, SubscriptionService } from "./pi";

// submitting only sends the transaction to the network, it has not landed yet
type SubmittedTransaction = {
  hash: string;
  status: string;
};

declare global {
  interface Window {
    __ENV?: {
      backendURL?: string;
      appWalletAddress?: string;
      subscriptionAudience?: string;
    };
    Pi: {
      init(options: { version: string }): Promise<void>;

      authenticate(scopes: string[], onIncompletePaymentFound: (payment: PaymentDTO) => void): Promise<AuthResult>;

      createPayment(
        data: {
          amount: number;
          memo: string;
          metadata: Record<string, unknown>;
          tokenCanonical?: string;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: PaymentDTO) => void;
        }
      ): Promise<unknown>;

      Wallet: {
        // needs the wallet_address scope, and answers only for apps on the platform's allowlist
        getUserWalletAddresses(): Promise<{ wallets: { publicKey: string }[] }>;
      };

      SmartContract: {
        Subscription: {
          subscribe(
            subscriber: string,
            serviceId: string,
            autoRenew: boolean,
            periods: string
          ): Promise<SubmittedTransaction>;
          process(merchant: string, serviceId: string, offset: number, limit: number): Promise<SubmittedTransaction>;
          getMerchantSubscriptions(merchant: string, serviceId: string): Promise<unknown>;
          // read-only calls: the SDK simulates them, nothing is signed
          getMerchantServices(merchant: string): Promise<SubscriptionService[]>;
          getSubscriberSubscriptions(subscriber: string): Promise<ContractSubscription[]>;
          isSubscriptionActive(subscriber: string, serviceId: string): Promise<boolean>;
        };

        pollTransaction(
          txHash: string,
          attempts?: number
        ): Promise<{ status: "SUCCESS" | "FAILED" | "NOT_FOUND"; ledger?: number; returnValue?: xdr.ScVal }>;
      };
    };
  }
}
