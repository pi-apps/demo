export class EscrowModule {
  hold(paymentId) {
    return { status: "held", paymentId };
  }
  release(paymentId) {
    return { status: "released", paymentId };
  }
}
