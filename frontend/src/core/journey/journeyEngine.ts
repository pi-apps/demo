import { eventBus } from "../events/eventBus";
import { journeyStore } from "./journeyStore";
import { traceEngine } from "../observability/traceEngine";

class JourneyEngine {
  init() {
    eventBus.on("ORDER_CREATED", (data: any) => {
      this.track(data.orderId, "CREATED");
    });

    eventBus.on("ORDER_CONFIRMED", (data: any) => {
      this.track(data.orderId, "CONFIRMED");
    });

    eventBus.on("DRIVER_ASSIGNED", (data: any) => {
      this.track(data.orderId, "DRIVER_ASSIGNED");
    });

    eventBus.on("WAREHOUSE_UPDATED", (data: any) => {
      this.track(data.orderId, "WAREHOUSE");
    });

    eventBus.on("DELIVERY_STARTED", (data: any) => {
      this.track(data.orderId, "DELIVERING");
    });

    eventBus.on("ORDER_DELIVERED", (data: any) => {
      this.track(data.orderId, "DELIVERED");
    });
  }

  private track(orderId: string, status: string) {
    journeyStore.addStep(orderId, status);

    traceEngine.log("ORDER_JOURNEY", {
      orderId,
      status,
    });
  }
}

export const journeyEngine = new JourneyEngine();