import { Pi } from "@pi-network/pi-sdk";

export class PiPayments {
  static async createPayment(amount, user) {
    const payment = await Pi.createPayment({
      amount,
      memo: "RoyalMix Payment",
      metadata: { userId: user }
    });
    return payment;
  }

  static async verifyPayment(paymentId) {
    return await Pi.verifyPayment(paymentId);
  }
}
