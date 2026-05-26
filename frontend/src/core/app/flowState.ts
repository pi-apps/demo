// src/core/app/flowState.ts

export type FlowStep =
  | "IDLE"
  | "AUTH_CHECK"
  | "ROUTE_RESOLVE"
  | "PAGE_LOADING"
  | "ENGINE_PROCESSING"
  | "REALTIME_SYNC"
  | "DONE"
  | "ERROR";

export interface FlowSnapshot {
  step: FlowStep;
  route?: string;
  userId?: string;
  role?: string;
  payload?: any;
  timestamp: number;
  meta?: Record<string, any>;
}

class FlowState {
  private current: FlowSnapshot = {
    step: "IDLE",
    timestamp: Date.now(),
  };

  private history: FlowSnapshot[] = [];

  set(step: FlowStep, data?: Partial<FlowSnapshot>) {
    const snapshot: FlowSnapshot = {
      step,
      route: data?.route,
      userId: data?.userId,
      role: data?.role,
      payload: data?.payload,
      meta: data?.meta,
      timestamp: Date.now(),
    };

    this.current = snapshot;
    this.history.push(snapshot);

    // chống memory leak
    if (this.history.length > 200) {
      this.history.shift();
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[FLOW STATE]", snapshot);
    }
  }

  getCurrent() {
    return this.current;
  }

  getHistory() {
    return this.history;
  }

  reset() {
    this.current = {
      step: "IDLE",
      timestamp: Date.now(),
    };
    this.history = [];
  }
}

export const flowState = new FlowState();