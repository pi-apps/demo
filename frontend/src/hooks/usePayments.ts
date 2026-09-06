import { useCallback, useState } from "react";
import { axiosClient } from "../lib/axiosClient";
import type { PaymentDTO } from "../types/pi";

type PaymentMetadata = {
  productId: string;
};

type UsePaymentsArgs = {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
  onPaymentComplete?: () => void;
};

export const IRRA_TOKEN_CANONICAL =
  "IRRA:GAAKMEW7GM5364YRRXFVVMF52R4YEEHB7LUNYTX3OONXUJKPKZXB6OK3";

export const usePayments = ({ isAuthenticated, onRequireAuth, onPaymentComplete }: UsePaymentsArgs) => {
  const [isLoading, setIsLoading] = useState(false);

  const onReadyForServerApproval = useCallback(async (paymentId: string) => {
    try {
      await axiosClient.post("/payments/approve", { paymentId });
    } catch (err) {
      console.error("Error approving payment:", err);
    }
  }, []);

  const onReadyForServerCompletion = useCallback(async (paymentId: string, txid: string) => {
    try {
      await axiosClient.post("/payments/complete", { paymentId, txid });
      onPaymentComplete?.();
    } catch (err) {
      console.error("Error completing payment:", err);
    }
  }, [onPaymentComplete]);

  const onCancel = useCallback(async (paymentId: string) => {
    try {
      await axiosClient.post("/payments/cancelled_payment", { paymentId });
    } catch (err) {
      console.error("Error cancelling payment:", err);
    }
  }, []);

  const onError = useCallback((error: Error, payment?: PaymentDTO) => {
    console.error("Payment error:", error, payment);
    setIsLoading(false);
  }, []);

  const orderProduct = useCallback(
    async (memo: string, amount: number, metadata: PaymentMetadata, tokenCanonical?: string) => {
      if (!isAuthenticated) {
        onRequireAuth();
        return;
      }

      setIsLoading(true);
      try {
        await window.Pi.createPayment(
          {
            amount,
            memo,
            metadata,
            ...(tokenCanonical ? { tokenCanonical } : {}),
          },
          {
            onReadyForServerApproval,
            onReadyForServerCompletion,
            onCancel,
            onError,
          }
        );
      } catch (err) {
        console.error("Error creating payment:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, onRequireAuth, onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError]
  );

  return {
    orderProduct,
    isLoading,
  };
};
