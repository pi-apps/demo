import { queryCache } from "./queryCache";

class QueryService {
  getOrders() {
    return queryCache.get("orders") || [];
  }

  getTracking(orderId: string) {
    const tracking =
      queryCache.get<any>("tracking") || {};

    return tracking[orderId];
  }

  getAssignedDriver(orderId: string) {
    const drivers =
      queryCache.get<any>("drivers") || {};

    return drivers[orderId];
  }

  debug() {
    return queryCache.debug();
  }
}

export const queryService =
  new QueryService();