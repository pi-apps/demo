export class IntentClassifier {
  classify(input) {
    if (input.includes("order")) return "ORDER_STATUS";
    if (input.includes("pay")) return "PAYMENT_HELP";
    return "UNKNOWN";
  }
}
