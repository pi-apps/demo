export type AppRole = "buyer" | "seller" | "driver" | "admin" | "guest";

export const authState = {
  getRole(): AppRole {
    return (localStorage.getItem("role") as AppRole) || "guest";
  },

  setRole(role: AppRole) {
    localStorage.setItem("role", role);
  },

  logout() {
    localStorage.setItem("role", "guest");
  },
};