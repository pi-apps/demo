import { eventBus } from "../events/eventBus";
import { mapStore } from "./mapStore";
import { traceEngine } from "../observability/traceEngine";
import { routeAnimationEngine } from "./routeAnimationEngine";

export function initMapListener() {
  eventBus.on("DRIVER_LOCATION_UPDATED", (data: any) => {
    mapStore.updatePosition(data);

    // STEP 14
    routeAnimationEngine.updateTarget(
      data.driverId,
      data.lat,
      data.lng
    );

    traceEngine.log("MAP_UPDATE", data);
  });
}