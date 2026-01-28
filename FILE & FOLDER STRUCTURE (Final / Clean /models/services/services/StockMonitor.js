import eventBus from "../events/eventBus.js";

export class StockMonitor {
  static check(stock) {
    if (stock.quantity <= stock.reorderLevel) {
      eventBus.emit("stock.low", stock);
    }
  }
}
