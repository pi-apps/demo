import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { RoleType } from '../../utils/constants';

const PI_USERNAME_KEY = 'piUsername';
const ROLE_KEY = 'userRole';

export const authService = {
  getSession() {
    return {
      username: localStorage.getItem(PI_USERNAME_KEY),
      role: localStorage.getItem(ROLE_KEY) as RoleType | null,
    };
  },

  async setAuth(username: string, role: RoleType) {
    localStorage.setItem(PI_USERNAME_KEY, username);
    localStorage.setItem(ROLE_KEY, role);

    // sync Firebase (optional layer)
    if (db) {
      try {
        await setDoc(
          doc(db, 'users', username),
          {
            piUsername: username,
            role,
            lastLogin: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Firebase sync error:', err);
      }
    }
  },

  clearAuth() {
    localStorage.removeItem(PI_USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};