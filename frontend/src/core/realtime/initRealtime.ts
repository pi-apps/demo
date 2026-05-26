import { syncEngine } from "./syncEngine";
import { replayEngine } from "./replayEngine";
import { eventBus } from "@/core/events/eventBus";

export function initRealtime() {
  console.log("⚡ REALTIME SYSTEM INIT");

  // record all events
  const originalEmit = eventBus.emit.bind(eventBus);

  eventBus.emit = (event: string, payload?: any) => {
    replayEngine.record(event, payload);
    originalEmit(event, payload);
  };
}