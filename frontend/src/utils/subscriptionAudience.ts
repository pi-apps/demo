import type { User } from "../types/pi";

// Who sees the Pi Bakery Club subscription flow (the card, the plan sheet and /club). Like the backend URL in
// axiosClient: set at runtime by the Docker entrypoint, or by Vite in development. Anything but "everyone" keeps
// it to core_team, so a missing or mistyped value never opens it to all users.
const getSubscriptionAudience = () => {
  const runtimeAudience = window.__ENV?.subscriptionAudience;

  if (runtimeAudience && runtimeAudience !== "$$SUBSCRIPTION_AUDIENCE$$") {
    return runtimeAudience;
  }

  return import.meta.env.VITE_SUBSCRIPTION_AUDIENCE;
};

const SUBSCRIPTION_AUDIENCE = getSubscriptionAudience()?.trim().toLowerCase() === "everyone" ? "everyone" : "core_team";

export const isSubscriptionEnabledFor = (user: User | null) =>
  user !== null && (SUBSCRIPTION_AUDIENCE === "everyone" || user.roles.includes("core_team"));
