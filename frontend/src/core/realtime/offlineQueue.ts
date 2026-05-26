// src/core/realtime/offlineQueue.ts

type QueuedEvent = {
  id: string;

  /**
   * NEW STANDARD FIELD (STEP 4 UPDATE)
   */
  event: string;

  payload: any;
  timestamp: number;
  retries?: number;
};

class OfflineQueue {
  private queue: QueuedEvent[] = [];
  private isOnline = true;

  /**
   * SET ONLINE/OFFLINE STATE
   */
  setOnline(status: boolean) {
    this.isOnline = status;

    if (status) {
      this.flush();
    }
  }

  /**
   * ✅ FIX STEP 4: UPDATED ADD API
   */
  add(event: QueuedEvent) {
    this.queue.push(event);
    this.persist();
  }

  /**
   * 🔥 BACKWARD COMPATIBILITY (KHÔNG BREAK CODE CŨ)
   */
  addLegacy(event: string, payload: any) {
    this.add({
      id: crypto.randomUUID(),
      event,
      payload,
      timestamp: Date.now(),
      retries: 0,
    });
  }

  /**
   * GET ALL QUEUE
   */
  getAll() {
    return this.queue;
  }

  /**
   * ALIAS
   */
  getQueue() {
    return this.queue;
  }

  /**
   * REMOVE BY ID
   */
  remove(id: string) {
    this.queue = this.queue.filter(
      (item) => item.id !== id
    );

    this.persist();
  }

  /**
   * CLEAR ALL
   */
  clear() {
    this.queue = [];
    this.persist();
  }

  /**
   * FLUSH QUEUE WHEN ONLINE
   */
  private async flush() {
    if (!this.isOnline || this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    for (const event of events) {
      try {
        await this.replay(event);
      } catch (err) {
        event.retries = (event.retries || 0) + 1;

        if (event.retries < 3) {
          this.queue.push(event);
        }
      }
    }

    this.persist();
  }

  /**
   * REPLAY EVENT TO SYSTEM
   */
  private async replay(event: QueuedEvent) {
    window.dispatchEvent(
      new CustomEvent("OFFLINE_REPLAY", {
        detail: event,
      })
    );
  }

  /**
   * PERSIST TO LOCAL STORAGE
   */
  private persist() {
    localStorage.setItem(
      "GHN_OFFLINE_QUEUE",
      JSON.stringify(this.queue)
    );
  }

  /**
   * LOAD FROM STORAGE
   */
  load() {
    const saved = localStorage.getItem("GHN_OFFLINE_QUEUE");

    if (saved) {
      try {
        this.queue = JSON.parse(saved);
      } catch (err) {
        console.error("[OfflineQueue] load failed", err);
        this.queue = [];
      }
    }
  }
}

/**
 * SINGLETON EXPORT
 */
export const offlineQueue = new OfflineQueue();