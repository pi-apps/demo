type Position = {
  lat: number;
  lng: number;
};

type AnimatedDriver = {
  driverId: string;
  current: Position;
  target: Position;
};

class RouteAnimationEngine {
  private drivers: Record<string, AnimatedDriver> = {};

  updateTarget(
    driverId: string,
    lat: number,
    lng: number
  ) {
    const existing = this.drivers[driverId];

    if (!existing) {
      this.drivers[driverId] = {
        driverId,
        current: { lat, lng },
        target: { lat, lng },
      };

      return;
    }

    existing.target = { lat, lng };
  }

  tick() {
    Object.values(this.drivers).forEach(driver => {
      driver.current.lat +=
        (driver.target.lat - driver.current.lat) * 0.1;

      driver.current.lng +=
        (driver.target.lng - driver.current.lng) * 0.1;
    });
  }

  getDrivers() {
    return Object.values(this.drivers);
  }

  clear() {
    this.drivers = {};
  }
}

export const routeAnimationEngine =
  new RouteAnimationEngine();