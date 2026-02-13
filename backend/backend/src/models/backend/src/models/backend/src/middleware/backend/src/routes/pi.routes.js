import express from "express";
const router = express.Router();

router.post("/link", (req, res) => {
  const { pi_username } = req.body;
  if (!pi_username) return res.status(400).json({ error: "Missing Pi username" });
  return res.json({ status: "linked", pi_username });
});

router.post("/transfer", (req, res) => {
  const { amount, receiver } = req.body;
  return res.json({ status: "success", amount, receiver });
});

export default router;
