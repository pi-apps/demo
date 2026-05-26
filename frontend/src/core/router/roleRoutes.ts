import { PAGE_REGISTRY } from "./pageRegistry";
import { AppRole } from "./types";

export function getRoutesByRole(role: AppRole) {
  return Object.values(PAGE_REGISTRY).filter((page) =>
    page.roles.includes(role)
  );
}