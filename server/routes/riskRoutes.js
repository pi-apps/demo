const express = require("express");
const router = express.Router();

router.get("/scan", (req, res) => {
  res.json({
    riskLevel: "LOW",
    message: "AI risk scan operational"
  });
});

module.exports = router;
