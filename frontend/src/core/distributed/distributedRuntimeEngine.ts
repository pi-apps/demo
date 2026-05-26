import { nodeRegistry }
from "./nodeRegistry";

import { replicationEngine }
from "./replicationEngine";

import { traceEngine }
from "../observability/traceEngine";

class DistributedRuntimeEngine {
  private nodeId =
    crypto.randomUUID();

  init(role: string) {
    nodeRegistry.register(
      this.nodeId,
      role
    );

    traceEngine.log(
      "NODE_REGISTERED",
      {
        nodeId: this.nodeId,
        role,
      }
    );

    // heartbeat loop
    setInterval(() => {
      nodeRegistry.heartbeat(
        this.nodeId
      );

      nodeRegistry
        .detectOfflineNodes();

      traceEngine.log(
        "NODE_HEARTBEAT",
        {
          nodeId: this.nodeId,
        }
      );
    }, 5000);
  }

  replicate(
    eventType: string,
    payload: any
  ) {
    replicationEngine.replicate(
      eventType,
      payload
    );
  }

  getNodeId() {
    return this.nodeId;
  }
}

export const distributedRuntimeEngine =
  new DistributedRuntimeEngine();