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
