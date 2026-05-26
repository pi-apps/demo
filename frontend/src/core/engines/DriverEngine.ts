import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";

class DriverEngineCore {
  // ================= CORE LOGIC =================

  assignDriver(orderId: string, driverId: string) {
    syncEngine.emit(EVENTS.DRIVER_ASSIGNED, {
      orderId,
      driverId,
      assignedAt: Date.now(),
      status: "assigned",
    });
  }

  updateDriverStatus(driverId: string, status: string) {
    syncEngine.emit(EVENTS.DRIVER_STATUS_UPDATED, {
      driverId,
      status,
      updatedAt: Date.now(),
    });
  }

  // ================= ADAPTER LAYER (FOR APP CONTROLLER) =================

  async assign(payload: any) {
    return this.assignDriver(payload.orderId, payload.driverId);
  }

  async update(payload: any) {
    return this.updateDriverStatus(payload.driverId, payload.status);
  }

  async sync() {
    // placeholder sync layer (sau này gắn realtime engine)
    return true;
  }

  async init() {
    // lifecycle init driver system
    return true;
  }

  async process(payload: any) {
    return this.assignDriver(payload.orderId, payload.driverId);
  }
}

export const DriverEngine = new DriverEngineCore();