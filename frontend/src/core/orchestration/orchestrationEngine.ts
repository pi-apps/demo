import {
  WorkflowStep,
  WorkflowState,
} from "./types";

import { traceEngine } from "../observability/traceEngine";

class OrchestrationEngine {
  private workflows:
    Record<string, WorkflowState> = {};

  async runWorkflow(
    workflowId: string,
    steps: WorkflowStep[]
  ) {
    this.workflows[workflowId] =
      "RUNNING";

    const completedSteps:
      WorkflowStep[] = [];

    try {
      for (const step of steps) {
        traceEngine.log(
          "WORKFLOW_STEP_START",
          {
            workflowId,
            step: step.name,
          }
        );

        await step.action();

        completedSteps.push(step);

        traceEngine.log(
          "WORKFLOW_STEP_DONE",
          {
            workflowId,
            step: step.name,
          }
        );
      }

      this.workflows[workflowId] =
        "COMPLETED";

      traceEngine.log(
        "WORKFLOW_COMPLETED",
        {
          workflowId,
        }
      );
    } catch (error) {
      this.workflows[workflowId] =
        "FAILED";

      traceEngine.log(
        "WORKFLOW_FAILED",
        {
          workflowId,
          error,
        }
      );

      // compensation rollback
      for (const step of completedSteps.reverse()) {
        try {
          await step.compensate?.();

          traceEngine.log(
            "WORKFLOW_COMPENSATED",
            {
              workflowId,
              step: step.name,
            }
          );
        } catch (err) {
          console.error(
            "[COMPENSATION FAILED]",
            err
          );
        }
      }
    }
  }

  getWorkflowState(workflowId: string) {
    return this.workflows[workflowId];
  }

  debug() {
    return this.workflows;
  }
}

export const orchestrationEngine =
  new OrchestrationEngine();