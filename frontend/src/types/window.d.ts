import { AuthResult, PaymentDTO } from "./pi";

declare global {
  interface Window {
    __ENV?: {
      backendURL?: string;
      frontendURL?: string;
      sandbox?: string;
    };
    Pi: {
      authenticate(scopes: string[], onIncompletePaymentFound: (payment: PaymentDTO) => void): Promise<AuthResult>;

      signIn(options: {
        clientId: string;
        redirectUri: string;
        scopes?: string[];
        state?: string;
      }): Promise<unknown>;

      createPayment(
        data: {
          amount: number;
          memo: string;
          metadata: Record<string, unknown>;
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
