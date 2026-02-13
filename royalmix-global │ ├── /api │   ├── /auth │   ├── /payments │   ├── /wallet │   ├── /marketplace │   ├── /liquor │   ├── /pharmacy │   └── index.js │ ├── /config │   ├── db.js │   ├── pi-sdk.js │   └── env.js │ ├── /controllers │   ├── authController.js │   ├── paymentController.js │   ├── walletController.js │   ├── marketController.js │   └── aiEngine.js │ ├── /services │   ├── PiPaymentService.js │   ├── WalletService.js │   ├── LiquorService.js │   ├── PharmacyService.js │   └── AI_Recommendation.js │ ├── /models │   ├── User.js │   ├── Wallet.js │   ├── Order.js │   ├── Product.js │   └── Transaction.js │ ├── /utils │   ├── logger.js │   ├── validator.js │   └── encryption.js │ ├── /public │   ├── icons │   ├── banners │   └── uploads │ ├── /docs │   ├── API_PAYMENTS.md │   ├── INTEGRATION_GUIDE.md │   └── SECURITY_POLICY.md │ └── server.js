import Pi from "@pi-network/sdk";
import express from "express";

const app = express();
app.use(express.json());

Pi.init({
  apiKey: process.env.PI_API_KEY,
  walletPrivateKey: process.env.PI_PRIVATE_KEY,
  environment: "sandbox"
});

app.post("/api/payments/create", async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const payment = await Pi.createPayment({
      amount,
      memo: "Royal Mix Global Purchase",
      metadata: { userId }
    });

    res.status(200).json({ payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
