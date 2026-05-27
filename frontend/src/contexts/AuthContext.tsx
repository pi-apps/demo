import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
  user: ReturnType<typeof useAuth>["user"];
  isAuthenticated: boolean;
  showSignIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  closeSignIn: () => void;
  requireAuth: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={{
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
      showSignIn: auth.showSignIn,
      signIn: auth.signIn,
      signOut: auth.signOut,
      closeSignIn: auth.closeSignIn,
      requireAuth: auth.requireAuth,
      isLoading: auth.isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
