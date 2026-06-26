import { createBrowserRouter } from "react-router-dom";
import Shop from "./pages/Shop";
import EngagementTasksPage from "./pages/EngagementTasksPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignInCallbackPage from "./pages/SignInCallbackPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Shop />,
  },
  {
    path: "/engagement-tasks",
    element: <EngagementTasksPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-in/callback",
    element: <SignInCallbackPage />,
  },
]);

export default router;
