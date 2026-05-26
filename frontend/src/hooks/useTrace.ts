import { useCallback } from "react";
import { traceEngine } from "@/core/observability/traceEngine";
import { flowGraph } from "@/core/observability/flowGraph";

export const useTrace = () => {
  const log = useCallback((layer: string, event: any) => {
    traceEngine.log(layer, event);
  }, []);

  const getTraces = useCallback(() => {
    return traceEngine.getAll();
  }, []);

  const getGraph = useCallback(() => {
    return flowGraph.build();
  }, []);

  const getSummary = useCallback(() => {
    return flowGraph.printSummary();
  }, []);

  const clear = useCallback(() => {
    traceEngine.clear();
  }, []);

  return {
    log,
    getTraces,
    getGraph,
    getSummary,
    clear,
  };
};