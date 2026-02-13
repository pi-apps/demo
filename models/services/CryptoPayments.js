export class CryptoPayments {
  static generateAddress(wallet) {
    return `ADDR-${wallet}-${Date.now()}`;
  }

  static confirmTransaction(hash) {
    return { confirmed: true, hash };
  }
}
