export type JourneyStep = {
  status: string;
  timestamp: number;
};

export type OrderJourney = {
  orderId: string;
  steps: JourneyStep[];
};

class JourneyStore {
  private journeys: Record<string, OrderJourney> = {};

  addStep(orderId: string, status: string) {
    if (!this.journeys[orderId]) {
      this.journeys[orderId] = {
        orderId,
        steps: [],
      };
    }

    this.journeys[orderId].steps.push({
      status,
      timestamp: Date.now(),
    });
  }

  getJourney(orderId: string) {
    return this.journeys[orderId];
  }

  getAll() {
    return Object.values(this.journeys);
  }

  clear() {
    this.journeys = {};
  }
}

export const journeyStore = new JourneyStore();