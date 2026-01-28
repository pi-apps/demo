const express = require("express");
const router = express.Router();
const controller = require("./integrationController");

router.post("/sync-payment", controller.syncCitizenPayment);
router.post("/sync-business", controller.registerBusinessSync);
router.post("/sync-agent", controller.agentActivitySync);

module.exports = router;
