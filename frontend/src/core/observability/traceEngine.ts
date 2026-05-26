type TraceEvent = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  layer: string;
};

class TraceEngine {
  private traces: TraceEvent[] = [];

  log(layer: string, event: any) {
    const trace: TraceEvent = {
      id: crypto.randomUUID(),
      type: event.type || "UNKNOWN",
      payload: event.payload || event,
      timestamp: Date.now(),
      layer,
    };

    this.traces.push(trace);

    // limit memory
    if (this.traces.length > 500) {
      this.traces.shift();
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[TRACE:${layer}]`, trace);
    }
  }

  getAll() {
    return this.traces;
  }

  getByType(type: string) {
    return this.traces.filter(t => t.type === type);
  }

  clear() {
    this.traces = [];
  }
}

export const traceEngine = new TraceEngine();