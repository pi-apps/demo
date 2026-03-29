import { useCallback, useState } from "react";
import { axiosClient } from "../lib/axiosClient";
import type { PaymentDTO } from "../types/pi";

type PaymentMetadata = {
  productId: string;
};

type UsePaymentsArgs = {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
};

export const usePayments = ({ isAuthenticated, onRequireAuth }: UsePaymentsArgs) => {
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
    } catch (err) {
      console.error("Error completing payment:", err);
    }
  }, []);

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
    async (memo: string, amount: number, metadata: PaymentMetadata) => {
      if (!isAuthenticated) {
        onRequireAuth();
        return;
      }

      setIsLoading(true);
      try {
        await window.Pi.createPayment(
          { amount, memo, metadata },
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
