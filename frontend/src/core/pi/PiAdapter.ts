// src/core/pi/PiAdapter.ts

import type { RoleType } from '@/utils/constants';

export interface PiUser {
  uid: string;
  username: string;
  name?: string;
  role?: RoleType;
}

export interface PiPayment {
  identifier: string;
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
}

export interface PiPaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PiAuthResult {
  user: PiUser;
  accessToken?: string;
}

export interface PiAdapter {
  authenticate(): Promise<PiUser>;

  getUser(): Promise<PiUser | null>;

  isAuthenticated(): boolean;

  logout(): void;

  createPayment?(
    payment: PiPayment
  ): Promise<PiPaymentResult>;
}