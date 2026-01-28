const express = require("express");
const router = express.Router();
const ai = require("./aiController");

router.get("/economic-overview", ai.getEconomicOverview);
router.get("/fraud-detection", ai.detectFraud);
router.get("/sme-growth", ai.getSMEGrowth);

module.exports = router;
