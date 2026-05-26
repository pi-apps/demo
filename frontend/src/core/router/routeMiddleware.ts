import { PAGE_REGISTRY } from "./pageRegistry";
import { AppRole, PageKey } from "./types";

export function canAccess(
  role: AppRole,
  pageKey: PageKey
): boolean {
  const page = PAGE_REGISTRY[pageKey];

  if (!page) return false;

  return page.roles.includes(role);
}