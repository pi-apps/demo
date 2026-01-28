import { Pi } from "@pi/sdk";

export class PiGateway {
  async initiatePayment(amount, userId) {
    return await Pi.createPayment({
      amount: amount,
      memo: "RoyalMix Purchase",
      metadata: { user_id: userId }
    });
  }
}
