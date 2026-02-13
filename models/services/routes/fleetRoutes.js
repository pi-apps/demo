import express from "express";
import { FleetManager } from "../services/FleetManager.js";

const router = express.Router();

router.post("/update-location", (req, res) => {
  FleetManager.updateLocation(req.body.driver, req.body.location);
  res.json({ status: "updated" });
});

router.post("/nearest-driver", (req, res) => {
  const driver = FleetManager.assignDriver(req.body.drivers, req.body.location);
  res.json(driver);
});

export default router;
