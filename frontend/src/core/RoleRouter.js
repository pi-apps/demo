export function getDashboardByRole(role) {
  switch (role) {
    case "government": return "/govtech";
    case "agent": return "/agents";
    case "citizen": return "/citizen";
    default: return "/";
  }
}
