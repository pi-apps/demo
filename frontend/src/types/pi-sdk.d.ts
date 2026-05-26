export {};

interface PiSDK {
  authenticate: (...args: any[]) => Promise<any>;
}

declare global {
  interface Window {
    Pi: PiSDK;
  }
}