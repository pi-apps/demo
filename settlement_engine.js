export class SettlementEngine {
  distribute(funds) {
    return {
      supplier: funds * 0.70,
      driver: funds * 0.20,
      platform: funds * 0.10
    };
  }
}
