export type NetworkStatus = "online" | "offline";

class NetworkMonitor {
  private status: NetworkStatus = "online";
  private listeners: ((status: NetworkStatus) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.setStatus("online"));
      window.addEventListener("offline", () => this.setStatus("offline"));
    }
  }

  setStatus(status: NetworkStatus) {
    this.status = status;
    this.listeners.forEach((l) => l(status));
  }

  getStatus() {
    return this.status;
  }

  subscribe(cb: (status: NetworkStatus) => void) {
    this.listeners.push(cb);
  }
}

export const networkMonitor = new NetworkMonitor();