router.post("/create-address", (req, res) => {
  return res.json({ address: "0xGeneratedWalletAddress" });
});

router.post("/send", (req, res) => {
  const { amount, to } = req.body;
  return res.json({ status: "sent", amount, to });
});
