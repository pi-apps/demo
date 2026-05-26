import React, {
  useEffect,
  useState,
} from "react";

import { orchestrationEngine }
from "@/core/orchestration/orchestrationEngine";

import { startOrderWorkflow }
from "@/core/orchestration/orderWorkflow";

export default function WorkflowDashboardPage() {
  const [workflows, setWorkflows] =
    useState<any>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflows(
        orchestrationEngine.debug()
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startWorkflow = async () => {
    await startOrderWorkflow({
      orderId:
        crypto.randomUUID(),
      status: "created",
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        ⚙️ WORKFLOW ORCHESTRATION
      </h2>

      <button
        onClick={startWorkflow}
        style={btn}
      >
        🚀 Start Workflow
      </button>

      <div style={{ marginTop: 20 }}>
        {Object.entries(workflows)
          .map(([id, state]) => (
            <div key={id} style={card}>
              <div>
                Workflow: {id}
              </div>

              <div>
                State:
                {" "}
                {String(state)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

const btn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const card = {
  background: "#fff",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "12px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};