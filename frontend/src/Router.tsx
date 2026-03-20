import { createBrowserRouter } from "react-router-dom";
import Shop from "./pages/Shop";
import EngagementTasksPage from "./pages/EngagementTasksPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Shop />,
  },
  {
    path: "/engagement-tasks",
    element: <EngagementTasksPage />,
  },
]);

export default router;
