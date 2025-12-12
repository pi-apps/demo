const express = require('express');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  // TODO: Replace with real scoring logic
  const score = 80; // Placeholder score
  res.json({ userId, score });
});

module.exports = router;
