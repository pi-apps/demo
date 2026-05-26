import { snapshotEngine } from "./snapshotEngine";
import { eventStore } from "../events/eventStore";
import { traceEngine } from "../observability/traceEngine";

class StateRestoreEngine {
  restore() {
    const snapshot = snapshotEngine.load();

    if (!snapshot) {
      traceEngine.log("STATE_RESTORE", {
        status: "NO_SNAPSHOT",
      });

      return {};
    }

    const rebuiltState = {
      ...snapshot.state,
    };

    // replay only newer events
    const newerEvents = eventStore
      .getAll()
      .filter(
        e => e.timestamp > snapshot.timestamp
      );

    newerEvents.forEach(event => {
      rebuiltState[event.type] =
        event.payload;
    });

    traceEngine.log("STATE_RESTORE", {
      status: "RESTORED",
      eventsReplayed: newerEvents.length,
    });

    return rebuiltState;
  }
}

export const stateRestoreEngine =
  new StateRestoreEngine();