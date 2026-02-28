import { Router } from "express";
import platformAPIClient from "../services/platformAPIClient";

export default function mountNotificationEndpoints(router: Router) {
  router.post("/send", async (req, res) => {
    try {
      const { notifications } = req.body || {};

      if (!Array.isArray(notifications) || notifications.length === 0) {
        return res
          .status(400)
          .json({ message: "notifications array is required" });
      }

      // Forward to Platform API: POST /v2/in_app_notifications/notify
      const response = await platformAPIClient.post(
        "/v2/in_app_notifications/notify",
        { notifications }
      );

      return res.status(200).json(response.data);
    } catch (err: any) {
      const status = err?.response?.status || 500;
      const data = err?.response?.data || {
        message: "Failed to send notifications",
      };
      return res.status(status).json(data);
    }
  });
}
