export class ReceiptEngine {
  generate(order) {
    return `Receipt #${order.id}\nTotal: ${order.total}`;
  }
}
