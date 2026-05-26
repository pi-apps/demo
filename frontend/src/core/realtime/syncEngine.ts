// src/core/realtime/syncEngine.ts

import { eventBus } from "@/core/events/eventBus";
import { offlineQueue } from "./offlineQueue";
import { networkMonitor } from "./network";

class SyncEngine {
  constructor() {
    networkMonitor.subscribe((status) => {
      if (status === "online") {
        this.flushQueue();
      }
    });
  }

  /**
   * MAIN EMIT FUNCTION
   */
  emit(event: string, payload: any) {
    if (networkMonitor.getStatus() === "offline") {
      offlineQueue.add({
        id: crypto.randomUUID(),
        event,
        payload,
        timestamp: Date.now(),
        retries: 0,
      });

      console.log("📴 queued:", event);
      return;
    }

    eventBus.emit(event, payload);
  }

  /**
   * FLUSH OFFLINE QUEUE WHEN ONLINE
   */
  flushQueue() {
    const queue = offlineQueue.getAll();

    queue.forEach((item) => {
      console.log("🔄 retry:", item.event);

      try {
        eventBus.emit(item.event, item.payload);

        offlineQueue.remove(item.id);
      } catch (err) {
        console.error("[SyncEngine] retry failed:", item.event, err);

        item.retries = (item.retries || 0) + 1;

        if (item.retries < 3) {
          // keep in queue
        } else {
          offlineQueue.remove(item.id);
        }
      }
    });
  }
}

export const syncEngine = new SyncEngine();