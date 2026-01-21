const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { escrowId, reason } = req.body;
  // TODO: Log dispute and notify admin
  res.json({ escrowId, status: 'dispute logged', reason });
});

module.exports = router;
