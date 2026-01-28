import express from "express";
import { PaymentsEngine } from "../services/PaymentsEngine.js";
import { PiPayments } from "../services/PiPayments.js";

const router = express.Router();

router.post("/pi/create", async (req, res) => {
  const result = await PiPayments.createPayment(req.body.amount, req.body.user);
  res.json(result);
});

router.post("/validate", (req, res) => {
  const valid = PaymentsEngine.validateTransaction(req.body);
  res.json({ valid });
});

export default router;
