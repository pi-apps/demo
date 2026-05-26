export type RuntimeNode = {
  nodeId: string;
  role: string;
  lastHeartbeat: number;
  status: "ONLINE" | "OFFLINE";
};

class NodeRegistry {
  private nodes:
    Record<string, RuntimeNode> = {};

  register(
    nodeId: string,
    role: string
  ) {
    this.nodes[nodeId] = {
      nodeId,
      role,
      lastHeartbeat: Date.now(),
      status: "ONLINE",
    };
  }

  heartbeat(nodeId: string) {
    if (!this.nodes[nodeId]) return;

    this.nodes[nodeId]
      .lastHeartbeat = Date.now();

    this.nodes[nodeId]
      .status = "ONLINE";
  }

  detectOfflineNodes() {
    const now = Date.now();

    Object.values(this.nodes)
      .forEach(node => {
        if (
          now - node.lastHeartbeat >
          15000
        ) {
          node.status = "OFFLINE";
        }
      });
  }

  getAll() {
    return Object.values(this.nodes);
  }
}

export const nodeRegistry =
  new NodeRegistry();