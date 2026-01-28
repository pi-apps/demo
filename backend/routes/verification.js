const express = require("express");
const router = express.Router();

router.post("/verify-id", (req, res) => {
  res.json({ status: "verified", level: "KYC Level 2" });
});

router.post("/verify-business", (req, res) => {
  res.json({ status: "business verified" });
});

module.exports = router;
