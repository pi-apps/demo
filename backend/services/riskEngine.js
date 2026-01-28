exports.detectRisk = (transaction) => {
  if (transaction.amount > 10000) {
    return { risk: "HIGH", reason: "Large transaction" };
  }
  return { risk: "LOW" };
};
