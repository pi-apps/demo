export class AISafety {
  constructor() {
    this.failCount = 0;
    this.threshold = 3;
  }

  recordFailure() {
    this.failCount++;
    if (this.failCount >= this.threshold) {
      return { locked: true, message: "AI fail-lock triggered" };
    }
    return { locked: false };
  }

  reset() {
    this.failCount = 0;
  }
}
