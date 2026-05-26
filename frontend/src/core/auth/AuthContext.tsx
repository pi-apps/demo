import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { piService, type PiUser } from '../pi/piService';
import type { AppRole } from '@/utils/constants';

interface AuthContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;           // ← Giữ isLoading để rõ nghĩa
  role: AppRole | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<AppRole | null>(null);

  const isAuthenticated = !!user;

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await piService.getUser();
      setUser(currentUser);
      if (currentUser?.role) {
        setRole(currentUser.role as AppRole);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const loggedInUser = await piService.authenticate();
      setUser(loggedInUser);
      setRole((loggedInUser.role as AppRole) || null);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    piService.logout();
    setUser(null);
    setRole(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    role,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};