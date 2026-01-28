import express from "express";
import { DriverController } from "../controllers/driverController.js";

const router = express.Router();

router.post("/location", DriverController.updateLocation);
router.post("/confirm", DriverController.confirmDelivery);

export default router;
