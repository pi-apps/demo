// src/core/realtime/replayEngine.ts

import { realtimeConsistencyEngine } from "./consistencyEngine";

type ReplayRecord = {
  id: string;
  event: string;
  payload: any;
  timestamp: number;
};

class ReplayEngine {
  private processed = new Set<string>();

  /**
   * INIT LISTENER
   */
  init() {
    window.addEventListener("OFFLINE_REPLAY", this.handleReplay);
  }

  /**
   * HANDLE OFFLINE REPLAY EVENT
   */
  private handleReplay = (event: any) => {
    const data = event.detail;

    if (!data?.id) return;

    if (this.processed.has(data.id)) return;

    this.processed.add(data.id);

    realtimeConsistencyEngine.enqueue({
      id: data.id,
      type: data.type,
      payload: data.payload,
      timestamp: data.timestamp,
    });
  };

  /**
   * ✅ FIX STEP 3: NEW OFFICIAL API
   */
  recordEvent(event: string, payload: any) {
    const record: ReplayRecord = {
      id: `${event}_${Date.now()}`,
      event,
      payload,
      timestamp: Date.now(),
    };

    realtimeConsistencyEngine.enqueue({
      id: record.id,
      type: record.event,
      payload: record.payload,
      timestamp: record.timestamp,
    });
  }

  /**
   * 🔥 BACKWARD COMPATIBILITY (KHÔNG BREAK CODE CŨ)
   */
  record(event: string, payload: any) {
    this.recordEvent(event, payload);
  }

  /**
   * RESET PROCESSED CACHE
   */
  reset() {
    this.processed.clear();
  }
}

/**
 * SINGLETON INSTANCE
 */
export const replayEngine = new ReplayEngine();