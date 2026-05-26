import { lazy } from "react";
import type { AppRole } from "@/utils/constants";
import type { PageKey, PageConfig } from "./types";

export type { AppRole };

export const PAGE_REGISTRY: Record<PageKey, PageConfig> = {
  HOME: {
    key: "HOME",
    path: "/",
    component: lazy(() => import("@/pages/HomePage")),
    roles: ["guest", "buyer", "seller", "driver"],
  },

  LOGIN: {
    key: "LOGIN",
    path: "/login",
    component: lazy(() => import("@/pages/LoginPage")),
    roles: ["guest"],
  },

  DASHBOARD: {
    key: "DASHBOARD",
    path: "/dashboard",
    component: lazy(() => import("@/pages/DashboardPage")),
    roles: ["buyer", "seller", "admin"],
  },

  ORDER: {
    key: "ORDER",
    path: "/order",
    component: lazy(() => import("@/pages/OrderPage")),
    roles: ["buyer", "seller"],
  },

  TRACKING: {
    key: "TRACKING",
    path: "/tracking",
    component: lazy(() => import("@/pages/TrackingPage")),
    roles: ["buyer", "seller", "driver"],
  },

  WAREHOUSE: {
    key: "WAREHOUSE",
    path: "/warehouse",
    component: lazy(() => import("@/pages/WarehousePage")),
    roles: ["seller", "admin"],
  },

  DRIVER: {
    key: "DRIVER",
    path: "/driver",
    component: lazy(() => import("@/pages/DriverPage")),
    roles: ["driver"],
  },

  PROFILE: {
    key: "PROFILE",
    path: "/profile",
    component: lazy(() => import("@/pages/ProfilePage")),
    roles: ["buyer", "seller", "driver", "admin"],
  },

  // ==================== ADVANCED ROUTES (ĐÃ CÓ CODE THẬT) ====================
  MAP: {
    key: "MAP",
    path: "/map",
    component: lazy(() => import("@/core/map/MapPage")),
    roles: ["admin", "driver", "seller", "guest"],
  },

  JOURNEY: {
    key: "JOURNEY",
    path: "/journey",
    component: lazy(() => import("@/pages/OrderJourneyPage")),
    roles: ["admin", "seller", "guest"],
  },

  EVENT_REPLAY: {
    key: "EVENT_REPLAY",
    path: "/event-replay",
    component: lazy(() => import("@/pages/EventReplayPage")),
    roles: ["admin"],
  },

  SNAPSHOT: {
    key: "SNAPSHOT",
    path: "/snapshot",
    component: lazy(() => import("@/pages/SnapshotPage")),
    roles: ["admin"],
  },

  CQRS: {
    key: "CQRS",
    path: "/cqrs",
    component: lazy(() => import("@/pages/CQRSDashboardPage")),
    roles: ["admin", "guest"],
  },

  WORKFLOW: {
    key: "WORKFLOW",
    path: "/workflow",
    component: lazy(() => import("@/pages/WorkflowDashboardPage")),
    roles: ["admin"],
  },

  DISTRIBUTED: {
    key: "DISTRIBUTED",
    path: "/distributed",
    component: lazy(() => import("@/pages/DistributedRuntimePage")),
    roles: ["admin"],
  },

  SYSTEM: {
    key: "SYSTEM",
    path: "/system",
    component: lazy(() => import("@/pages/SystemDashboardPage")),
    roles: ["admin"],
  },
};