type Snapshot = {
  timestamp: number;
  state: any;
};

class SnapshotEngine {
  private STORAGE_KEY = "GHN_PI_SNAPSHOT";

  save(state: any) {
    const snapshot: Snapshot = {
      timestamp: Date.now(),
      state,
    };

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(snapshot)
    );
  }

  load(): Snapshot | null {
    const raw = localStorage.getItem(
      this.STORAGE_KEY
    );

    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const snapshotEngine =
  new SnapshotEngine();