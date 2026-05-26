import React, {
  useEffect,
  useState,
} from "react";

import { nodeRegistry }
from "@/core/distributed/nodeRegistry";

import { distributedRuntimeEngine }
from "@/core/distributed/distributedRuntimeEngine";

export default function DistributedRuntimePage() {
  const [nodes, setNodes] =
    useState<any[]>([]);

  useEffect(() => {
    distributedRuntimeEngine.init(
      "admin"
    );

    const interval = setInterval(() => {
      setNodes(
        nodeRegistry.getAll()
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>
        🌐 DISTRIBUTED RUNTIME
      </h2>

      {nodes.map(node => (
        <div
          key={node.nodeId}
          style={card}
        >
          <div>
            Node:
            {" "}
            {node.nodeId}
          </div>

          <div>
            Role:
            {" "}
            {node.role}
          </div>

          <div>
            Status:
            {" "}
            {node.status}
          </div>

          <div>
            Heartbeat:
            {" "}
            {new Date(
              node.lastHeartbeat
            ).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#fff",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "12px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};