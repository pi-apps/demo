export type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
    roles: string[];
  };
};

export type User = AuthResult["user"];

export type PaymentStatus = {
  developer_approved: boolean;
  transaction_verified: boolean;
  developer_completed: boolean;
  cancelled: boolean;
  user_cancelled: boolean;
};

export type PaymentDTO = {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  memo: string;
  metadata: Record<string, unknown>;
  status: PaymentStatus;
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
};

// What the subscription contract returns, as the SDK decodes it: u64 and i128 values arrive as strings.
// Field names read from the contract's spec on Pi Testnet (CCUF75B6...KPFYV), 21 Oct 2026.
export type SubscriptionService = {
  service_id: string;
  merchant: string;
  name: string;
  // in the token's smallest unit (Test-Pi has 7 decimals)
  price: string;
  period_secs: string;
  trial_period_secs: string;
  approve_periods: string;
  is_active: boolean;
  created_at: string;
};

export type ContractSubscription = {
  sub_id: string;
  service_id: string;
  subscriber: string;
  price: string;
  period_secs: string;
  trial_period_secs: string;
  auto_renew: boolean;
  // unix timestamps in seconds
  created_at: string;
  next_charge_ts: string;
  service_end_ts: string;
  trial_end_ts: string;
};
