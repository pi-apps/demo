function calculateScore(userId) {
  const txHistory = getUserTransactions(userId);
  const disputes = getUserDisputes(userId);
  const score = (txHistory.successful * 10) - (disputes.length * 15);
  return Math.max(score, 0);
}
