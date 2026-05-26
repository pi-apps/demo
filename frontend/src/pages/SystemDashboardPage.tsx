import React, { useEffect, useState } from "react";
import { traceEngine } from "@/core/observability/traceEngine";
import { flowGraph } from "@/core/observability/flowGraph";

export default function SystemDashboardPage() {
  const [traces, setTraces] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [graph, setGraph] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTraces(traceEngine.getAll());
      setSummary(flowGraph.printSummary());
      setGraph(flowGraph.build());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>🚀 GHN.PI SYSTEM DASHBOARD</h2>

      {/* SUMMARY */}
      <section>
        <h3>📊 Event Summary</h3>
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      </section>

      {/* TRACE LOG */}
      <section>
        <h3>🧠 Trace Logs</h3>
        <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #ccc" }}>
          {traces.slice(-50).map((t, i) => (
            <div key={i} style={{ fontSize: 12, padding: 4 }}>
              [{t.layer}] {t.type} → {t.timestamp}
            </div>
          ))}
        </div>
      </section>

      {/* FLOW GRAPH */}
      <section>
        <h3>🔗 Flow Graph (Simplified)</h3>
        <pre>{JSON.stringify(graph.slice(-20), null, 2)}</pre>
      </section>
    </div>
  );
}