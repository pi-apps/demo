// src/core/pi/MockPiService.ts
import { PiAdapter, PiUser } from "./PiAdapter";

export class MockPiService implements PiAdapter {
  private _currentUser: PiUser | null = null;

  get currentUser(): PiUser | null {
    return this._currentUser;
  }

  isAuthenticated(): boolean {
    return this._currentUser !== null;
  }

  async getUser(): Promise<PiUser | null> {
    return this._currentUser;
  }

  async authenticate(): Promise<PiUser> {
    const mockUser: PiUser = {
      username: "test_user_123",
      uid: "mock-uid-123456",
      role: "driver",
    };

    this._currentUser = mockUser;
    return mockUser;
  }

  logout(): void {
    this._currentUser = null;
  }
}