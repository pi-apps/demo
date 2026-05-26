import React, { useState } from "react";

import { eventStore } from "@/core/events/eventStore";
import { eventSourcingEngine } from "@/core/events/eventSourcingEngine";

export default function EventReplayPage() {
  const [state, setState] = useState<any>({});
  const [events, setEvents] = useState<any[]>(
    eventStore.getAll()
  );

  const handleReplay = () => {
    const rebuilt =
      eventSourcingEngine.rebuildState();

    setState(rebuilt);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>⏪ EVENT SOURCING REPLAY</h2>

      <button
        onClick={handleReplay}
        style={btn}
      >
        🔄 Rebuild State
      </button>

      <h3>📦 Event History</h3>

      <div style={box}>
        {events.map((e, idx) => (
          <div key={idx} style={eventItem}>
            [{e.type}] {new Date(e.timestamp).toLocaleTimeString()}
          </div>
        ))}
      </div>

      <h3>🧠 Reconstructed State</h3>

      <pre style={stateBox}>
        {JSON.stringify(state, null, 2)}
      </pre>
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

const box = {
  background: "#0f172a",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  maxHeight: "300px",
  overflow: "auto",
};

const stateBox = {
  background: "#111827",
  color: "#22c55e",
  padding: "12px",
  borderRadius: "12px",
  overflow: "auto",
};
const eventItem = {
  marginBottom: "8px",
};