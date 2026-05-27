import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EngagementTasksPage from "./pages/EngagementTasksPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import GenericPage from "./pages/GenericPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import HowItWorksPage from "./pages/HowItWorksPage.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import FaqPage from "./pages/FaqPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import WhitePaperPage from "./pages/WhitePaperPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/white-paper",
    element: <WhitePaperPage />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/faq",
    element: <FaqPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/affiliate",
    element: <GenericPage title="Affiliate Program" description="Affiliate page conversion is in progress." />,
  },
  {
    path: "/collaborate",
    element: <GenericPage title="Collaborate With Us" description="Collaboration page conversion is in progress." />,
  },
  {
    path: "/partners",
    element: <GenericPage title="Partners" description="Partners page conversion is in progress." />,
  },
  {
    path: "/community",
    element: <GenericPage title="Community" description="Community page conversion is in progress." />,
  },
  {
    path: "/developers",
    element: <GenericPage title="Developers" description="Developers page conversion is in progress." />,
  },
  {
    path: "/privacy",
    element: <GenericPage title="Privacy Policy" description="Privacy Policy page conversion is in progress." />,
  },
  {
    path: "/terms",
    element: <GenericPage title="Terms & Conditions" description="Terms page conversion is in progress." />,
  },
  {
    path: "/cookies",
    element: <GenericPage title="Cookie Policy" description="Cookie Policy page conversion is in progress." />,
  },
  {
    path: "/report-abuse",
    element: <GenericPage title="Report Abuse" description="Report Abuse page conversion is in progress." />,
  },
  {
    path: "/engagement-tasks",
    element: <EngagementTasksPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
