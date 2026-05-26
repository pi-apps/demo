import React from 'react';
import { useAuth } from "@/core/auth/AuthContext";
import { RoleType } from '../../utils/constants';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { role, isLoading } = useAuth();

  // ⏳ đang load session
  if (isLoading) {
    return <div>Loading session...</div>;
  }

  // ❌ chưa login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // ❌ sai role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <div>⛔ Không có quyền truy cập</div>;
  }

  // ✅ OK
  return <>{children}</>;
}