import { orchestrationEngine }
from "./orchestrationEngine";

import { eventBus }
from "../events/eventBus";

export async function startOrderWorkflow(
  order: any
) {
  await orchestrationEngine.runWorkflow(
    `order-${order.orderId}`,
    [
      {
        name: "CREATE_ORDER",

        action: async () => {
          eventBus.emit(
            "ORDER_CREATED",
            order
          );
        },

        compensate: async () => {
          eventBus.emit(
            "ORDER_CANCELLED",
            order
          );
        },
      },

      {
        name: "ASSIGN_DRIVER",

        action: async () => {
          eventBus.emit(
            "DRIVER_ASSIGNED",
            {
              orderId: order.orderId,
              driverId: "DRV-001",
            }
          );
        },
      },

      {
        name: "START_DELIVERY",

        action: async () => {
          eventBus.emit(
            "DELIVERY_STARTED",
            {
              orderId: order.orderId,
            }
          );
        },
      },

      {
        name: "COMPLETE_ORDER",

        action: async () => {
          eventBus.emit(
            "ORDER_DELIVERED",
            {
              orderId: order.orderId,
            }
          );
        },
      },
    ]
  );
}