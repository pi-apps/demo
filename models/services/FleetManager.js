export class FleetManager {
  static assignDriver(drivers, location) {
    return drivers.sort(
      (a, b) => a.distanceTo(location) - b.distanceTo(location)
    )[0];
  }

  static updateLocation(driver, newLoc) {
    driver.location = newLoc;
  }
}
