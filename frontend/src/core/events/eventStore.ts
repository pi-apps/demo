export type StoredEvent = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
};

class EventStore {
  private events: StoredEvent[] = [];

  append(event: StoredEvent) {
    this.events.push(event);

    // limit memory
    if (this.events.length > 5000) {
      this.events.shift();
    }
  }

  getAll() {
    return this.events;
  }

  getByType(type: string) {
    return this.events.filter(e => e.type === type);
  }

  clear() {
    this.events = [];
  }
}

export const eventStore = new EventStore();