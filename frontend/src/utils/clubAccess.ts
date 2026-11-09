import type { User } from "../types/pi";

// Pi Bakery Club is open to core_team while the team tries it out; opening it to everyone is a code change.
export const canUseClub = (user: User | null) => user?.roles.includes("core_team") ?? false;
