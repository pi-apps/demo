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

export const usePayments = ({ isAuthenticated: _isAuthenticated, onRequireAuth: _onRequireAuth }: UsePaymentsArgs) => {
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

  //below code actually subscribes to the service
  const orderProduct1 = useCallback(async () => {
    //const res = await window.Pi.SmartContract.Subscription.registerService("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "new-test", "200000000", "120", "0", "12");
    //const res = await window.Pi.SmartContract.Subscription.getMerchantServices("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2");
    //const res = await window.Pi.SmartContract.Subscription.process("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "241", 0, 1);
    //const res = await window.Pi.SmartContract.Subscription.subscribe("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G", "249", true, "10");
    //const res = await window.Pi.SmartContract.Subscription.getSubscriberSubscriptions("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G");
    //const res = await window.Pi.SmartContract.Subscription.getService("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "69");
    ///const res = await window.Pi.SmartContract.Subscription.extendSubscription("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G","57");
    //const res = await window.Pi.SmartContract.pollTransaction("9db4228497076d92603f617a896bc09466c911b919d3a8e060b00de450cadf35", 10);
    const res = await window.Pi.SmartContract.Subscription.process("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "249", 0, 1);
    //const res = (await window.Pi.SmartContract.Subscription.process("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "248", 0, 1)) as { hash: string };
    //const finalRes = await window.Pi.SmartContract.pollTransaction(res.hash);
    //const res = await window.Pi.SmartContract.Subscription.getSubscription("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G", "67");

    //const res = await window.Pi.SmartContract.Subscription.getSubscriptionReservation("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G", "63");

    console.log('First Res: ', res);
    //console.log('First Final Result: ', finalRes);
  }, []);

  const orderProduct2 = useCallback(async () => {
    //const res1 = await window.Pi.SmartContract.Subscription.getSubscriberSubscriptions("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G");
    //const res = await window.Pi.SmartContract.Subscription.getSubscription("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G", "61");
    //const res = await window.Pi.SmartContract.Subscription.registerService("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "sub-app-no-free-trial", "5000000", "300", "0", "12");
    //const res = await window.Pi.SmartContract.Subscription.getMerchantServices("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2");
    //const res = await window.Pi.SmartContract.Subscription.subscribe("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G", "206", true, "1");
    //const res = await window.Pi.SmartContract.Subscription.process("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "240", 0, 1);
    //const res = await window.Pi.SmartContract.Subscription.extendSubscription("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G","63", "4");
    //const res = await window.Pi.SmartContract.Subscription.getService("GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2", "209");
    const res1 = await window.Pi.SmartContract.Subscription.getSubscription("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G", "79");

    const res2 = await window.Pi.SmartContract.Subscription.getSubscriptionReservation("GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G", "79");

      console.log('Second res1: ', res1);
      console.log('Second res2: ', res2);
    }, []);

  // const orderProduct = useCallback(
  //   async (memo: string, amount: number, metadata: PaymentMetadata) => {
  //     if (!isAuthenticated) {
  //       onRequireAuth();
  //       return;
  //     }

  //     setIsLoading(true);
  //     try {
  //       await window.Pi.createPayment(
  //         { amount, memo, metadata },
  //         {
  //           onReadyForServerApproval,
  //           onReadyForServerCompletion,
  //           onCancel,
  //           onError,
  //         }
  //       );
  //     } catch (err) {
  //       console.error("Error creating payment:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [isAuthenticated, onRequireAuth, onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError]
  // );

  return {
    orderProduct1,
    orderProduct2,
    isLoading,
  };
};
