import { createBrowserRouter } from "react-router-dom";
import Shop from "./pages/Shop";
import EngagementTasksPage from "./pages/EngagementTasksPage.tsx";
import ClubPage from "./pages/ClubPage.tsx";
import ClubProvider from "./components/ClubProvider.tsx";

export const router = createBrowserRouter([
  {
    element: <ClubProvider />,
    children: [
      // pages that show the club ask for the wallet address permission (see ClubProvider)
      {
        path: "/",
        element: <Shop />,
        handle: { showsClub: true },
      },
      {
        path: "/club",
        element: <ClubPage />,
        handle: { showsClub: true },
      },
      {
        path: "/engagement-tasks",
        element: <EngagementTasksPage />,
      },
    ],
  },
]);

export default router;
