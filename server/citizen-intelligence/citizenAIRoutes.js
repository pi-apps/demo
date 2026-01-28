const express = require("express");
const router = express.Router();
const citizenAI = require("./citizenAIController");

router.get("/usage-stats", citizenAI.getCitizenUsageStats);
router.get("/service-demand", citizenAI.getServiceDemandMap);
router.get("/digital-inclusion", citizenAI.getDigitalInclusionReport);

module.exports = router;
