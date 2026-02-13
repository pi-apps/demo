export class PaymentsEngine {
  static validateTransaction(tx) {
    if (!tx.amount || tx.amount <= 0) return false;
    if (!tx.currency) return false;
    if (!tx.userId) return false;
    return true;
  }

  static convertCurrency(amount, rate) {
    return amount * rate;
  }
}
