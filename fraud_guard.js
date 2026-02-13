export class FraudGuard {
  evaluate(tx) {
    return tx.ip_reputation === "clean" &&
           tx.sim_swap === false &&
           tx.geo_match === true;
  }
}
