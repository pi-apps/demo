import { AuthResult, PaymentDTO } from "./pi";

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
    };
  }
}
