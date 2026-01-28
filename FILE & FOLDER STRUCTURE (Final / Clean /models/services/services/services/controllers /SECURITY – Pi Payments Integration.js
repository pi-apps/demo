export async function initiatePiPayment(wallet, amount) {
  return {
    wallet,
    amount,
    status: "INITIATED",
    timestamp: Date.now()
  };
    }
