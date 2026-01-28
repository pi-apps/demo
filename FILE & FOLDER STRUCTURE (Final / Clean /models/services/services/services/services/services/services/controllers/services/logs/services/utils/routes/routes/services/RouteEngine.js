export class RouteEngine {
  static optimize(deliveries = []) {
    return deliveries.sort((a, b) => a.distance - b.distance);
  }
}
