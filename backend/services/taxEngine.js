exports.processTaxPayment = async (user, amount, type) => {
  return {
    status: "success",
    message: `Payment processed for ${type}`,
    amount,
    timestamp: new Date()
  };
};
