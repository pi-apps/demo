import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";
import { eventBus } from "@/core/events/eventBus";

class TrackingEngineCore {
  // ================= CORE LOGIC =================

  updateTracking(data: any) {
    syncEngine.emit(EVENTS.TRACKING_UPDATED, {
      ...data,
      updatedAt: Date.now(),
    });
  }

  updateLocation(orderId: string, location: any) {
    syncEngine.emit(EVENTS.TRACKING_LOCATION_UPDATED, {
      orderId,
      location,
      timestamp: Date.now(),
    });
  }

  // ================= MAP UPDATE FOR DRIVER LOCATION (STEP 13.2) =================
  updateDriverLocation(payload: any) {
    eventBus.emit("DRIVER_LOCATION_UPDATED", {
      driverId: payload.driverId,
      lat: payload.lat,
      lng: payload.lng,
      updatedAt: Date.now(),
    });
  }

  // ================= ADAPTER LAYER (FOR APP CONTROLLER) =================

  async update(payload: any) {
    return this.updateTracking(payload);
  }

  async sync() {
    // placeholder cho realtime sync engine
    return true;
  }

  async init() {
    // lifecycle init tracking system
    return true;
  }

  // optional future-safe hook
  async process(payload: any) {
    return this.updateTracking(payload);
  }
}

export const TrackingEngine = new TrackingEngineCore();
