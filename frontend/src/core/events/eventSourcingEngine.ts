import { eventBus } from "./eventBus";
import { eventStore } from "./eventStore";
import { traceEngine } from "../observability/traceEngine";

class EventSourcingEngine {
  init() {
    const originalEmit = eventBus.emit.bind(eventBus);

    eventBus.emit = (type: string, payload?: any) => {
      const event = {
        id: crypto.randomUUID(),
        type,
        payload,
        timestamp: Date.now(),
      };

      // save history
      eventStore.append(event);

      // trace
      traceEngine.log("EVENT_SOURCE", event);

      // continue original emit
      originalEmit(type, payload);
    };
  }

  replay(callback?: (event: any) => void) {
    const events = eventStore.getAll();

    events.forEach(event => {
      callback?.(event);
    });
  }

  rebuildState() {
    const state: Record<string, any> = {};

    this.replay(event => {
      state[event.type] = event.payload;
    });

    return state;
  }
}

export const eventSourcingEngine =
  new EventSourcingEngine();