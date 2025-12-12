const express = require('express');
const router = express.Router();

router.post('/initiate', async (req, res) => {
  const { buyerId, sellerId, amount } = req.body;
  const escrowId = Date.now(); // Simple unique ID
  // TODO: Save to database or in-memory store
  res.json({ escrowId, status: 'pending' });
});

router.post('/release/:id', async (req, res) => {
  const escrowId = req.params.id;
  // TODO: Validate and release funds
  res.json({ escrowId, status: 'released' });
});

module.exports = router;
