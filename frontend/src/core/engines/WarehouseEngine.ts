import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";

class WarehouseEngineCore {
  // ================= CORE LOGIC =================

  createWarehouse(data: any) {
    syncEngine.emit(EVENTS.WAREHOUSE_CREATED, {
      ...data,
      createdAt: Date.now(),
      status: "active",
    });
  }

  updateWarehouseStock(warehouseId: string, stock: any) {
    syncEngine.emit(EVENTS.WAREHOUSE_STOCK_UPDATED, {
      warehouseId,
      stock,
      updatedAt: Date.now(),
    });
  }

  // ================= ADAPTER LAYER (FOR APP CONTROLLER) =================

  async init() {
    // init kho hệ thống
    return true;
  }

  async sync() {
    // sync dữ liệu kho với realtime layer
    return true;
  }

  async create(payload: any) {
    return this.createWarehouse(payload);
  }

  async update(payload: any) {
    return this.updateWarehouseStock(payload.warehouseId, payload.stock);
  }

  async process(payload: any) {
    return this.createWarehouse(payload);
  }
}

export const WarehouseEngine = new WarehouseEngineCore();