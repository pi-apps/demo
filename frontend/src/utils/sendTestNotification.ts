import { axiosClient } from "../lib/axiosClient.ts";
import type { User } from "../types/pi.ts";

// Sends the signed-in user a test in-app notification through the backend. In-app notifications are internal for
// now, not part of the public Pi Platform API, so this is for the Pi team's own testing.
export const sendTestNotification = (user: User | null) => {
  const notification = {
    title: "Test Notification",
    body: "This is a test notification",
    user_uid: user?.uid,
    subroute: "/shop",
  };
  axiosClient.post("/notifications/send", { notifications: [notification] });
};
