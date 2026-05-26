export type AppRole =
  | "buyer"
  | "seller"
  | "driver"
  | "admin"
  | "guest";

export type PageKey =
  | "HOME"
  | "LOGIN"
  | "DASHBOARD"
  | "ORDER"
  | "TRACKING"
  | "WAREHOUSE"
  | "DRIVER"
  | "PROFILE"
  | "MAP"
  | "JOURNEY"
  | "EVENT_REPLAY"
  | "SNAPSHOT"
  | "CQRS"
  | "WORKFLOW"
  | "DISTRIBUTED"
  | "SYSTEM";

export interface PageConfig {
  key: PageKey;
  path: string;
  component: React.LazyExoticComponent<any>;
  roles: AppRole[];
  title?: string;
  protected?: boolean;
  analyticsId?: string;
}