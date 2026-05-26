import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PAGE_REGISTRY } from "./pageRegistry";

type AppRole = "buyer" | "seller" | "driver" | "admin" | "guest";

interface GuardProps {
  role: AppRole | null;
  children: ReactNode;
}

/**
 * AUTH GUARD
 * - chặn user chưa login
 */
export function AuthGuard({ role, children }: GuardProps) {
  const location = useLocation();

  const isAuthenticated = role && role !== "guest";

  if (!isAuthenticated) {
    return <Navigate to={PAGE_REGISTRY.LOGIN.path} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * ROLE GUARD
 * - kiểm tra quyền truy cập page
 */
export function RoleGuard({
  role,
  allowedRoles,
  children,
}: GuardProps & { allowedRoles: AppRole[] }) {
  const location = useLocation();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={PAGE_REGISTRY.HOME.path} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}