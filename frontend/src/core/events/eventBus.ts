type EventHandler = (payload?: any) => void;

class EventBus {
  private events: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.events.get(event);
    if (!handlers) return;

    this.events.set(
      event,
      handlers.filter((h) => h !== handler)
    );
  }

  emit(event: string, payload?: any) {
    const handlers = this.events.get(event);
    if (!handlers) return;

    handlers.forEach((handler) => handler(payload));
  }

  clear() {
    this.events.clear();
  }
}

export const eventBus = new EventBus();