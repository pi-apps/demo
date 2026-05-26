// src/core/auth/AuthGuard.tsx

import React from 'react';
import { useAuth } from './AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuth();

  /**
   * ❌ NOT LOGGED IN
   */
  if (!isAuthenticated || !user) {
    return (
      <div style={blockStyle}>
        🚫 Bạn chưa đăng nhập
      </div>
    );
  }

  /**
   * ❌ ROLE CHECK
   */
  if (allowedRoles && !allowedRoles.includes(user?.role ?? '')) {
    return (
      <div style={blockStyle}>
        ⛔ Không có quyền truy cập
      </div>
    );
  }

  /**
   * ✅ PASS
   */
  return <>{children}</>;
}

/**
 * SIMPLE GUARD UI STYLE
 */
const blockStyle: React.CSSProperties = {
  padding: 20,
  textAlign: 'center',
  color: '#dc2626',
  fontWeight: 600,
};