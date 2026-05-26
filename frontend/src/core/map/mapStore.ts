type DriverPosition = {
  driverId: string;
  lat: number;
  lng: number;
  updatedAt: number;
};

class MapStore {
  private drivers: Record<string, DriverPosition> = {};

  updatePosition(data: DriverPosition) {
    this.drivers[data.driverId] = data;
  }

  getAll() {
    return Object.values(this.drivers);
  }

  getDriver(driverId: string) {
    return this.drivers[driverId];
  }

  clear() {
    this.drivers = {};
  }
}

export const mapStore = new MapStore();