const aiRoutes = require("./ai-intelligence/aiRoutes");
const walletRoutes = require("./wallet-sync/walletRoutes");
app.use("/api/ai", aiRoutes);
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Integration Layer
const integrationRoutes = require("./integration/integrationRoutes");
app.use("/api/integration", integrationRoutes);
app.use("/api/wallet", walletRoutes);
// Health check
app.get("/", (req, res) => {
  res.send("Royal Mix Integration Layer Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
