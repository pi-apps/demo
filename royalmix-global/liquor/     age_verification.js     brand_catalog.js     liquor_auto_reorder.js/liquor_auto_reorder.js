export class LiquorAutoReorder {
  check(stockLevel) {
    if (stockLevel < 10) return "Reorder triggered";
    return "Stock OK";
  }
}
