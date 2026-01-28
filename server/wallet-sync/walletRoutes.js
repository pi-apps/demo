const express = require("express");
const router = express.Router();
const controller = require("./walletController");

router.post("/pi-payment", controller.syncPiPayment);
router.post("/transfer", controller.transferBetweenWallets);

module.exports = router;
