// src/hooks/usePiAuth.ts
import { useAuth } from '../core/auth/AuthContext';

export const usePiAuth = () => {
  const auth = useAuth();

  return {
    piUsername: auth.user?.username || '',
    isPiConnected: auth.isAuthenticated,
    userRole: auth.role,
    loading: auth.isLoading,           // ← Giữ tên loading để tương thích với component cũ

    loginWithPi: auth.login,
    logout: auth.logout,
    refreshUser: auth.refreshUser,
  };
};