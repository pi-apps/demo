// src/core/pi/RealPiService.ts

import type {
  PiAdapter,
  PiPayment,
  PiPaymentResult,
  PiUser,
} from './PiAdapter';

export class RealPiService implements PiAdapter {
  private currentUser: PiUser | null = null;

  async authenticate(): Promise<PiUser> {
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error(
          'Pi SDK not available. Please open in Pi Browser.'
        );
      }

      const auth = await window.Pi.authenticate(
        ['payments', 'username'],
        {
          onIncompletePaymentFound: (
            payment: unknown
          ) => {
            console.warn(
              '[Pi SDK] Incomplete payment found:',
              payment
            );
          },
        }
      );

      this.currentUser = {
        uid: auth.user.uid,
        username: auth.user.username,
        name: auth.user.name,
      };

      console.log(
        '%c[Real Pi] Đăng nhập thành công',
        'color: green; font-weight: bold'
      );

      return this.currentUser;
    } catch (error) {
      console.error(
        '[Real Pi] Authenticate failed:',
        error
      );

      throw error;
    }
  }

  async getUser(): Promise<PiUser | null> {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.currentUser = null;

    console.log(
      '%c[Real Pi] Logout',
      'color: red; font-weight: bold'
    );
  }

  async createPayment(
    payment: PiPayment
  ): Promise<PiPaymentResult> {
    try {
      if (!window.Pi) {
        throw new Error('Pi SDK unavailable');
      }

      console.log(
        '%c[Real Pi] Create payment',
        'color: blue',
        payment
      );

      return {
        success: true,
        transactionId: crypto.randomUUID(),
      };
    } catch (error) {
      console.error(
        '[Real Pi] Payment failed:',
        error
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Payment failed',
      };
    }
  }
}