router.post("/debit", (req, res) => {
  res.json({ status: "processing", gateway: "MTN/Airtel/M-Pesa" });
});
