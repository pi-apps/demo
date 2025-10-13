app.post('/api/dispute', async (req, res) => {
  const { escrowId, reason } = req.body;
  // Log dispute and notify admin
  res.json({ status: 'dispute logged' });
});
