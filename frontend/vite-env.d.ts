/// <reference types="vite/client" />

interface Window {
  Pi: {
    authenticate: (
      scopes: string[],
      onIncompletePaymentFound: (payment: any) => void
    ) => Promise<{
      accessToken: string;
      user: {
        username: string;
        uid: string;
      };
    }>;
  };
}