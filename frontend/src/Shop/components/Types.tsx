/*
* this file contains all of the types and interfaces that
* are used by the various components of the front end.
*
* update or add, the types or interfaces your app needs
*/


export type AuthResult = {
    accessToken: string,
    user: {
      uid: string,
      username: string
    }
    };
    
    export type User = AuthResult['user'];

    export type RefundType = {
      _id: string,
      pi_payment_id: string,
      product_id: string,
      user: string,
      amount: number,
      txid: string,
      paid: boolean,
      cancelled: boolean,
      completed: boolean,
      created_at: string,
      is_refund: boolean,
      refunded_at: string
    };
    
    export type UserContextType = {
      user: { uid: string; username: string; };
      saveUser: () => void;
      showModal: boolean;
      saveShowModal: (value: boolean) => void;
      refunds: RefundType[];
      saveRefunds: () => void;
      onModalClose: () => void;
    }

    export type MyPaymentMetadata = {};
    
    export interface PaymentDTO {
    amount: number,
    user_uid: string,
    created_at: string,
    identifier: string,
    metadata: Object,
    memo: string,
    status: {
      developer_approved: boolean,
      transaction_verified: boolean,
      developer_completed: boolean,
      cancelled: boolean,
      user_cancelled: boolean,
    },
    to_address: string,
    transaction: null | {
      txid: string,
      verified: boolean,
      _link: string,
    },
    }; 
  
  // Make TS accept the existence of our window.__ENV object - defined in index.html:
  export interface WindowWithEnv extends Window {
      __ENV?: {
        backendURL: string, // REACT_APP_BACKEND_URL environment variable
        sandbox: "true" | "false", // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
      }
    }
  