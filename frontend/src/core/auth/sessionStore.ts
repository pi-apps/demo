import { defaultSession, Session, UserRole } from './session';

const STORAGE_KEY = 'GHN_PI_SESSION';

class SessionStore {
  private session: Session = defaultSession;

  constructor() {
    this.restore();
  }

  getSession() {
    return this.session;
  }

  setSession(session: Session) {
    this.session = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  setRole(role: UserRole) {
    this.session.role = role;
    this.setSession(this.session);
  }

  login(userId: string, token: string, role: UserRole) {
    this.session = {
      userId,
      token,
      role,
      isAuthenticated: true,
    };

    this.setSession(this.session);
  }

  logout() {
    this.session = defaultSession;
    localStorage.removeItem(STORAGE_KEY);
  }

  restore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      this.session = JSON.parse(raw);
    } catch {
      this.session = defaultSession;
    }
  }
}

export const sessionStore = new SessionStore();