import eventBus from "../utils/eventBus.js";

export const DriverController = {
  updateLocation(req, res) {
    eventBus.emit("driver.location.update", req.body);
    res.json({ status: "location updated" });
  },

  confirmDelivery(req, res) {
    eventBus.emit("delivery.completed", req.body);
    res.json({ status: "delivery confirmed" });
  }
};
