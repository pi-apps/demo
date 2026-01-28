export class TrackingNode {
  registerEvent(orderId, status) {
    return {
      orderId,
      status,
      timestamp: Date.now()
    };
  }
}
