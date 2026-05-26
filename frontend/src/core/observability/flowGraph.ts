import { traceEngine } from "./traceEngine";

class FlowGraph {
  build() {
    const traces = traceEngine.getAll();

    const graph = traces.map((t, index) => ({
      node: index,
      type: t.type,
      layer: t.layer,
      time: t.timestamp,
    }));

    return graph;
  }

  printSummary() {
    const traces = traceEngine.getAll();

    const summary: Record<string, number> = {};

    traces.forEach(t => {
      summary[t.type] = (summary[t.type] || 0) + 1;
    });

    return summary;
  }
}

export const flowGraph = new FlowGraph();