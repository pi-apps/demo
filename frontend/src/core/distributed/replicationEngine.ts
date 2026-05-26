import { eventBus }
from "../events/eventBus";

import { traceEngine }
from "../observability/traceEngine";

class ReplicationEngine {
  replicate(
    eventType: string,
    payload: any
  ) {
    traceEngine.log(
      "EVENT_REPLICATED",
      {
        eventType,
        payload,
      }
    );

    // future:
    // websocket
    // p2p
    // firebase
    // websocket cluster

    eventBus.emit(
      "REPLICATION_RECEIVED",
      {
        eventType,
        payload,
      }
    );
  }
}

export const replicationEngine =
  new ReplicationEngine();