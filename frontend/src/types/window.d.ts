import { AuthResult, PaymentDTO } from "./pi";

declare global {
  interface Window {
    __ENV?: {
      backendURL?: string;
      sandbox?: string;
    };
    Pi: {
      authenticate(scopes: string[], onIncompletePaymentFound: (payment: PaymentDTO) => void): Promise<AuthResult>;

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

      SmartContract: {
        Subscription: {
          getSubscriberSubscriptions(subscriberId: string): Promise<unknown>;
          subscribe(subscriberId: string, productId: string, isAutoRenew: boolean, someParam: string): Promise<unknown>;
          registerService(subscriberId: string, serviceName: string, serviceDescription: string, servicePrice: string, serviceDuration: string, serviceInterval: string): Promise<unknown>;
          getMerchantServices(merchantId: string): Promise<unknown>;
          getService(merchantId: string, serviceId: string): Promise<unknown>;
          process(merchant: string, serviceId: string | bigint, offset: string | number | bigint, limit: string | number | bigint, options?: ExecuteOptions): Promise<unknown>;
          extendSubscription(subscriberId: string, subscriptionId: string | bigint, newDuration: string | number | bigint, options?: ExecuteOptions): Promise<unknown>;
          getSubscription(subscriberId: string, subscriptionId: string | bigint): Promise<unknown>;
          pollTransaction(txHash: string, attempts?: number): Promise<unknown>;
          getSubscriptionReservation(subscriberId: string, subscriptionId: string | bigint): Promise<unknown>;
        };
          pollTransaction(txHash: string, attempts?: number): Promise<unknown>;
      };
    };
  }
}
