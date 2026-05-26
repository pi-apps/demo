"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mountNotificationEndpoints;
const platformAPIClient_1 = __importDefault(require("../services/platformAPIClient"));
function mountNotificationEndpoints(router) {
    router.post("/send", async (req, res) => {
        try {
            const { notifications } = req.body || {};
            if (!Array.isArray(notifications) || notifications.length === 0) {
                return res
                    .status(400)
                    .json({ message: "notifications array is required" });
            }
            // Forward to Platform API: POST /v2/in_app_notifications/notify
            const response = await platformAPIClient_1.default.post("/v2/in_app_notifications/notify", { notifications });
            return res.status(200).json(response.data);
        }
        catch (err) {
            const status = err?.response?.status || 500;
            const data = err?.response?.data || {
                message: "Failed to send notifications",
            };
            return res.status(status).json(data);
        }
    });
}
