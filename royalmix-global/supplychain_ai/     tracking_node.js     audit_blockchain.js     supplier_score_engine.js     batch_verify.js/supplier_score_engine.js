export class SupplierScoreEngine {
  score(supplier) {
    let score = 100;
    if (!supplier.on_time_delivery) score -= 25;
    if (supplier.quality_issues) score -= 40;
    return Math.max(0, score);
  }
}
