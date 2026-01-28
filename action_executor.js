export class ActionExecutor {
  perform(intent, data) {
    if (intent === "ORDER_STATUS") return "Your order is 15 minutes away.";
    return "How may I assist you?";
  }
}
