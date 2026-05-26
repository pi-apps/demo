import { EVENTS } from "../events/eventTypes";

type EventPacket = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
};

type RuleResult = "ACCEPT" | "REJECT" | "MERGE";

class ConflictResolver {
  private lastState: Record<string, any> = {};

  resolve(event: EventPacket): RuleResult {
    const prev = this.lastState[event.type];

    // chưa có state → luôn accept
    if (!prev) {
      this.lastState[event.type] = event.payload;
      return "ACCEPT";
    }

    // 1. RULE: timestamp mới hơn thắng
    if (event.timestamp > prev.timestamp) {
      this.lastState[event.type] = event.payload;
      return "ACCEPT";
    }

    // 2. RULE: same timestamp → MERGE logic
    if (event.timestamp === prev.timestamp) {
      this.lastState[event.type] = {
        ...prev,
        ...event.payload,
      };
      return "MERGE";
    }

    // 3. RULE: old event → reject
    return "REJECT";
  }

  // ================= BUSINESS RULE OVERRIDES =================

  resolveBusiness(event: EventPacket): RuleResult {
    switch (event.type) {
      case EVENTS.ORDER_CONFIRMED:
        return this.priorityHigh(event);

      case EVENTS.DRIVER_ASSIGNED:
        return this.priorityHigh(event);

      case EVENTS.TRACKING_LOCATION_UPDATED:
        return this.priorityMedium(event);

      case EVENTS.WAREHOUSE_STOCK_UPDATED:
        return this.priorityLow(event);

      default:
        return this.resolve(event);
    }
  }

  private priorityHigh(event: EventPacket): RuleResult {
    // order/driver luôn ưu tiên cao
    this.lastState[event.type] = event.payload;
    return "ACCEPT";
  }

  private priorityMedium(event: EventPacket): RuleResult {
    return this.resolve(event);
  }

  private priorityLow(event: EventPacket): RuleResult {
    const prev = this.lastState[event.type];

    if (!prev) {
      this.lastState[event.type] = event.payload;
      return "ACCEPT";
    }

    // chỉ update nếu khác nhiều (giảm spam update kho)
    const diff = JSON.stringify(prev) !== JSON.stringify(event.payload);

    if (diff) {
      this.lastState[event.type] = event.payload;
      return "ACCEPT";
    }

    return "REJECT";
  }

  reset() {
    this.lastState = {};
  }

  debug() {
    return this.lastState;
  }
}

export const conflictResolver = new ConflictResolver();