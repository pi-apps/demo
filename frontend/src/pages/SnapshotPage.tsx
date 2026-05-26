import React, { useState } from "react";

import { snapshotEngine } from "@/core/state/snapshotEngine";

export default function SnapshotPage() {
  const [snapshot, setSnapshot] =
    useState<any>(
      snapshotEngine.load()
    );

  const refresh = () => {
    setSnapshot(snapshotEngine.load());
  };

  const clear = () => {
    snapshotEngine.clear();
    refresh();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💾 SNAPSHOT ENGINE</h2>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={refresh}
          style={btn}
        >
          🔄 Refresh Snapshot
        </button>

        <button
          onClick={clear}
          style={{
            ...btn,
            background: "#dc2626",
          }}
        >
          🗑 Clear Snapshot
        </button>
      </div>

      <pre style={box}>
        {JSON.stringify(snapshot, null, 2)}
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
  marginRight: "10px",
};

const box = {
  background: "#111827",
  color: "#22c55e",
  padding: "16px",
  borderRadius: "12px",
  overflow: "auto",
};