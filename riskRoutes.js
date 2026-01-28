const express = require("express");
const router = express.Router();
const riskController = require("./riskController");
const verifyGovToken = require("../middleware/verifyGovToken");

router.post("/analyze", verifyGovToken, riskController.checkTransactionRisk);

module.exports = router;
