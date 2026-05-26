// src/utils/constants.ts

// ==================== ROLES ====================
export type AppRole = 
  | "guest"
  | "buyer" 
  | "seller"
  | "driver"
  | "admin"
  | "warehouse";

export type RoleType = AppRole;

export const ROLES = {
  GUEST: "guest" as const,
  BUYER: "buyer" as const,
  SELLER: "seller" as const,
  DRIVER: "driver" as const,
  ADMIN: "admin" as const,
  WAREHOUSE: "warehouse" as const,
} as const;

// ==================== EXPORT DEFAULT (nếu cần) ====================
export default {
  ROLES,
};