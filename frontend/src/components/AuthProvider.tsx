import type { ReactNode } from "react";
import { AuthContext, useAuthState } from "../hooks/useAuth";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthState();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
