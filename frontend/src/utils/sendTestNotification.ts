import { axiosClient } from "../lib/axiosClient.ts";
import type { User } from "../types/pi.ts";

export const sendTestNotification = (user: User | null) => {
  const notification = {
    title: "Test Notification",
    body: "This is a test notification",
    user_uid: user?.uid,
    subroute: "/shop",
  };
  axiosClient.post("/notifications/send", { notifications: [notification] });
};
