export type WorkflowStep = {
  name: string;
  action: () => Promise<void>;
  compensate?: () => Promise<void>;
};

export type WorkflowState =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";