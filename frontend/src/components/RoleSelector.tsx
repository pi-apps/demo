import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { RoleType, ROLES } from '@/utils/constants';

interface AuthContextType {
  userRole: RoleType | null;
  piUsername: string | null;
  loading: boolean;
  setAuth: (username: string, role: RoleType) => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<RoleType | null>(localStorage.getItem('userRole') as RoleType | null);
  const [piUsername, setPiUsername] = useState<string | null>(localStorage.getItem('piUsername'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const setAuth = async (username: string, role: RoleType) => {
    setPiUsername(username);
    setUserRole(role);
    localStorage.setItem('piUsername', username);
    localStorage.setItem('userRole', role);

    if (username && db) {
      try {
        await setDoc(doc(db, "users", username), {
          piUsername: username,
          role: role,
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Lỗi lưu Firebase:", err);
      }
    }
  };

  const clearAuth = () => {
    setPiUsername(null);
    setUserRole(null);
    localStorage.removeItem('piUsername');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ userRole, piUsername, loading, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};