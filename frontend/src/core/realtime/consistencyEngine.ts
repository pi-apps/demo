import { eventBus } from "../events/eventBus";
import { conflictResolver } from "./conflictResolver";

type EventPacket = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
};

class RealtimeConsistencyEngine {
  private queue: EventPacket[] = [];
  private processing = false;
  private lastProcessed: Record<string, number> = {};

  // ================= ENTRY =================
  enqueue(event: EventPacket) {
    // 1. chống duplicate event
    if (this.isDuplicate(event)) return;

    this.queue.push(event);

    // sort theo timestamp để đảm bảo ordering
    this.queue.sort((a, b) => a.timestamp - b.timestamp);

    this.process();
  }

  // ================= PROCESSOR =================
  private async process() {
    if (this.processing) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const event = this.queue.shift()!;
      await this.handle(event);
    }

    this.processing = false;
  }

  // ================= HANDLER =================
private async handle(event: EventPacket) {
  try {
    // ================= CONFLICT RESOLUTION STEP 10 =================
    const result = conflictResolver.resolveBusiness(event);

    if (result === "REJECT") {
      if (process.env.NODE_ENV !== "production") {
        console.log("[CONSISTENCY REJECTED]", event);
      }
      return;
    }

    // MERGE case → conflictResolver đã merge state bên trong
    if (result === "MERGE") {
      if (process.env.NODE_ENV !== "production") {
        console.log("[CONSISTENCY MERGED]", event);
      }
    }

    // ACCEPT or MERGE → update last processed
    this.lastProcessed[event.type] = event.timestamp;

    // emit safe event
    eventBus.emit(event.type, event.payload);
  } catch (err) {
    console.error("[CONSISTENCY ENGINE ERROR]", err);
  }
}

  // ================= DUPLICATE GUARD =================
  private isDuplicate(event: EventPacket) {
    const last = this.lastProcessed[event.type];

    if (!last) return false;

    // nếu event cũ hơn hoặc bằng → bỏ
    return event.timestamp <= last;
  }

  // ================= RESET =================
  reset() {
    this.queue = [];
    this.lastProcessed = {};
    this.processing = false;
  }

  // ================= DEBUG =================
  debug() {
    return {
      queueLength: this.queue.length,
      lastProcessed: this.lastProcessed,
      processing: this.processing,
    };
  }
}

export const realtimeConsistencyEngine =
  new RealtimeConsistencyEngine();