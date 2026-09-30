import type { xdr } from "@stellar/stellar-base";
import { AuthResult, PaymentDTO } from "./pi";

// submitting only sends the transaction to the network, it has not landed yet
type SubmittedTransaction = {
  hash: string;
  status: string;
};

declare global {
  interface Window {
    __ENV?: {
      backendURL?: string;
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
        getUserWalletAddresses(): Promise<{ wallets: Array<{ publicKey: string }> }>;
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
          getSubscription(subscriber: string, subscriptionId: string): Promise<unknown>;
          getMerchantSubscriptions(merchant: string, serviceId: string): Promise<unknown>;
        };

        pollTransaction(
          txHash: string,
          attempts?: number
        ): Promise<{ status: "SUCCESS" | "FAILED" | "NOT_FOUND"; ledger?: number; returnValue?: xdr.ScVal }>;
      };
    };
  }
}
