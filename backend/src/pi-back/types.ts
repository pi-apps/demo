export type PaymentArgs = {
  amount: number;
  memo: string;
  metadata: object;
  uid: string;
};

export type TransactionData = {
  amount: number;
  paymentIdentifier: string;
  fromAddress: string;
  toAddress: string;
};

export type PaymentDTO = {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: object;
  from_address: string;
  to_address: string;
  direction: Direction;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: {
    txid: string;
    verified: boolean;
    _link: string;
  } | null;
  created_at: string;
  network: NetworkPassphrase;
};

export type NetworkPassphrase = "Pi Network" | "Pi Testnet";
export type Direction = "user_to_app" | "app_to_user";

export type AxiosClientOptions = {
  baseUrl?: string;
};
