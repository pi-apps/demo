export class NLPEngine {
  analyze(text) {
    return { intent: "order_status", entities: { orderId: "RMX-2026-001" } };
  }
}
