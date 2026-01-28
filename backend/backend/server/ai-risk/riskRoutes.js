const express = require("express");
const router = express.Router();
const { analyzeRisk } = require("./riskController");

router.get("/scan", analyzeRisk);

module.exports = router;
