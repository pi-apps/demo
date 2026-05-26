import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";

class OrderEngineCore {
  // ===== CORE ACTIONS (giữ nguyên logic bạn đang có) =====

  createOrder(order: any) {
    syncEngine.emit(EVENTS.ORDER_CREATED, {
      ...order,
      createdAt: Date.now(),
      status: "created",
    });
  }

  confirmOrder(orderId: string) {
    syncEngine.emit(EVENTS.ORDER_CONFIRMED, {
      orderId,
      confirmedAt: Date.now(),
      status: "confirmed",
    });
  }

  // ===== ADD ADAPTER METHODS (QUAN TRỌNG CHO APP CONTROLLER) =====

  async create(payload: any) {
    return this.createOrder(payload);
  }

  async update(payload: any) {
    // fallback nếu sau này có update order
    syncEngine.emit(EVENTS.ORDER_UPDATED, {
      ...payload,
      updatedAt: Date.now(),
    });
  }

  async sync() {
    // placeholder sync để appController không lỗi
    return true;
  }

  async init() {
    // placeholder init lifecycle
    return true;
  }
}

export const OrderEngine = new OrderEngineCore();