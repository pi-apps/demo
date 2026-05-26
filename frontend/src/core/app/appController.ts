import { flowState } from "./flowState";
import { eventBus } from "../events/eventBus";
import { navigate } from "../router/navigationService";

// Engines
import { OrderEngine } from "../engines/OrderEngine";
import { TrackingEngine } from "../engines/TrackingEngine";
import { DriverEngine } from "../engines/DriverEngine";
import { WarehouseEngine } from "../engines/WarehouseEngine";
import { journeyEngine } from "../journey/journeyEngine";
import { eventSourcingEngine } from "../events/eventSourcingEngine";
import { projectionEngine } from "../cqrs/projectionEngine";
import { distributedRuntimeEngine } from "../distributed/distributedRuntimeEngine";

// State Management
import { autoSnapshotService } from "../state/autoSnapshotService";
import { stateRestoreEngine } from "../state/stateRestoreEngine";

// STEP 8–11 LAYERS
import { offlineQueue } from "../realtime/offlineQueue";
import { replayEngine } from "../realtime/replayEngine";
import { realtimeConsistencyEngine } from "../realtime/consistencyEngine";
import { conflictResolver } from "../realtime/conflictResolver";
import { traceEngine } from "../observability/traceEngine";

type AppAction =
  | "INIT_APP"
  | "NAVIGATE"
  | "CREATE_ORDER"
  | "UPDATE_TRACKING"
  | "ASSIGN_DRIVER"
  | "SYNC_ALL"
  | "ERROR";

class AppController {
  private static instance: AppController;

  static getInstance() {
    if (!AppController.instance) {
      AppController.instance = new AppController();
    }
    return AppController.instance;
  }

  // ================= MAIN DISPATCH =================
  async dispatch(action: AppAction, payload?: any) {
    const event = {
      id: crypto.randomUUID(),
      type: action,
      payload,
      timestamp: Date.now(),
    };

    traceEngine.log("APP_CONTROLLER", event);

    try {
      flowState.set("ENGINE_PROCESSING", {
        payload: { action, payload },
      });

      // ================= OFFLINE FIRST =================
      if (!navigator.onLine && action !== "INIT_APP") {
        offlineQueue.add({
          id: event.id,
          event: event.type,
          payload: event.payload,
          timestamp: event.timestamp,
        });

        traceEngine.log("OFFLINE_QUEUE", event);
        return;
      }

      // ================= ROUTING ACTIONS =================
      switch (action) {
        case "INIT_APP":
          await this.initApp();
          break;

        case "NAVIGATE":
          this.handleNavigate(payload);
          break;

        case "CREATE_ORDER":
          await this.safeProcess(event, () =>
            OrderEngine.create(payload)
          );
          break;

        case "UPDATE_TRACKING":
          await this.safeProcess(event, () =>
            TrackingEngine.update(payload)
          );
          break;

        case "ASSIGN_DRIVER":
          await this.safeProcess(event, () =>
            DriverEngine.assign(payload)
          );
          break;

        case "SYNC_ALL":
          await this.syncAll();
          break;

        default:
          console.warn("Unknown action:", action);
      }

      flowState.set("DONE", { payload: { action } });
    } catch (error: any) {
      flowState.set("ERROR", { payload: error });

      eventBus.emit("APP_ERROR", error);
      traceEngine.log("APP_ERROR", error);

      console.error("[APP CONTROLLER ERROR]", error);
    }
  }

  // ================= SAFE PROCESS PIPELINE =================
  private async safeProcess(event: any, fn: Function) {
    const result = conflictResolver.resolveBusiness(event);

    if (result === "REJECT") {
      traceEngine.log("REJECTED_EVENT", event);
      return;
    }

    if (result === "MERGE") {
      traceEngine.log("MERGED_EVENT", event);
    }

    realtimeConsistencyEngine.enqueue(event);

    await fn();
  }

  // ================= INIT APP =================
  private async initApp() {
    flowState.set("AUTH_CHECK");

    eventBus.emit("APP_INIT_START");
    traceEngine.log("INIT_APP_START", {});

    const restoredState = stateRestoreEngine.restore();
    console.log("[STATE RESTORED]", restoredState);

    await WarehouseEngine.init?.();
    await OrderEngine.init?.();
    await TrackingEngine.init?.();
    await DriverEngine.init?.();
    journeyEngine.init();
    eventSourcingEngine.init();
    projectionEngine.init();
    distributedRuntimeEngine.init("admin");

    offlineQueue.load();
    replayEngine.init();

    autoSnapshotService.start();

    eventBus.emit("APP_INIT_DONE");
    traceEngine.log("INIT_APP_DONE", {});
  }

  // ================= NAVIGATION =================
  private handleNavigate(route: string) {
    flowState.set("ROUTE_RESOLVE", { route });

    navigate(route);

    eventBus.emit("ROUTE_CHANGED", route);
    traceEngine.log("NAVIGATION", { route });
  }

  // ================= SYNC ALL =================
  private async syncAll() {
    flowState.set("REALTIME_SYNC");

    traceEngine.log("SYNC_START", {});

    await Promise.all([
      OrderEngine.sync?.(),
      TrackingEngine.sync?.(),
      DriverEngine.sync?.(),
      WarehouseEngine.sync?.(),
    ]);

    eventBus.emit("SYNC_DONE");
    traceEngine.log("SYNC_DONE", {});
  }
}

export const appController = AppController.getInstance();