export class SupplierRanking {
  static rank(suppliers) {
    return suppliers.sort((a, b) => b.score - a.score);
  }

  static calculateScore(stats) {
    return (
      stats.onTimeDelivery * 0.4 +
      stats.priceStability * 0.2 +
      stats.quality * 0.3 +
      stats.communication * 0.1
    );
  }
}
