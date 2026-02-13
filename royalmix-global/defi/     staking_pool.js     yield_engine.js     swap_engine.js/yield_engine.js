export class YieldEngine {
  calculate(amount, days) {
    return (amount * days * 0.0005).toFixed(2);
  }
}
