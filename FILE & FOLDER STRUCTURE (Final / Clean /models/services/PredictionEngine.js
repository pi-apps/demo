export class PredictionEngine {
  static forecast(dailySalesHistory = []) {
    if (dailySalesHistory.length < 3) return 5;

    const smoothingFactor = 0.6;

    let prediction = dailySalesHistory[0];
    for (let i = 1; i < dailySalesHistory.length; i++) {
      prediction =
        smoothingFactor * dailySalesHistory[i] +
        (1 - smoothingFactor) * prediction;
    }

    return Math.round(prediction);
  }
}
