export class MobileMoney {
  static async sendMoney(phone, amount) {
    return { status: "success", phone, amount };
  }

  static async receiveMoney(phone, amount) {
    return { status: "received", phone, amount };
  }
}
