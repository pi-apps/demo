import { eventStore } from "../events/eventStore";
import { snapshotEngine } from "./snapshotEngine";
import { traceEngine } from "../observability/traceEngine";

class AutoSnapshotService {
  private interval: any = null;

  start() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      const state: Record<string, any> = {};

      eventStore.getAll().forEach(event => {
        state[event.type] = event.payload;
      });

      snapshotEngine.save(state);

      traceEngine.log("SNAPSHOT_SAVED", {
        eventCount:
          eventStore.getAll().length,
      });
    }, 10000); // mỗi 10s
  }

  stop() {
    clearInterval(this.interval);
  }
}

export const autoSnapshotService =
  new AutoSnapshotService();