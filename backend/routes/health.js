const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "Royal Mix Global API Running" });
});

module.exports = router;
