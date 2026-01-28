export class WarehouseHeatmap {
  static generate(stockList) {
    return stockList.map(item => ({
      product: item.productName,
      temperature: item.quantity < item.reorderLevel ? "HOT" : "COLD"
    }));
  }
}
