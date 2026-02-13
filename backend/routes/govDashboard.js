const express = require("express");
const router = express.Router();

router.get("/stats", (req, res) => {
  res.json({
    totalRevenue: 125000,
    activeBusinesses: 8421,
    topSector: "Retail",
    alerts: []
  });
});

module.exports = router;
