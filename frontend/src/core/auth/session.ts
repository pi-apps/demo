export type UserRole = 'admin' | 'driver' | 'buyer' | 'seller' | 'warehouse' | 'guest';


export interface Session {
  userId: string | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
}

export const defaultSession: Session = {
  userId: null,
  role: 'guest',
  token: null,
  isAuthenticated: false,
};