import { eventBus } from "../events/eventBus";
import { queryCache } from "./queryCache";
import { traceEngine } from "../observability/traceEngine";

class ProjectionEngine {
  init() {
    // ================= ORDERS =================
    eventBus.on("ORDER_CREATED", (data: any) => {
      const orders =
        queryCache.get<any[]>("orders") || [];

      queryCache.set("orders", [
        ...orders,
        data,
      ]);

      traceEngine.log(
        "CQRS_ORDER_PROJECTION",
        data
      );
    });

    // ================= TRACKING =================
    eventBus.on(
      "TRACKING_UPDATED",
      (data: any) => {
        const tracking =
          queryCache.get("tracking") || {};

        tracking[data.orderId] = data;

        queryCache.set(
          "tracking",
          tracking
        );
      }
    );

    // ================= DRIVERS =================
    eventBus.on(
      "DRIVER_ASSIGNED",
      (data: any) => {
        const drivers =
          queryCache.get("drivers") || {};

        drivers[data.orderId] =
          data.driverId;

        queryCache.set(
          "drivers",
          drivers
        );
      }
    );
  }
}

export const projectionEngine =
  new ProjectionEngine();