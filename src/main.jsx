import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ErrorPage from "./views/Error/error-page";

import CalculatorLanding from "./views/Calculator/CalculatorLanding";
import CalculatorPersonal from "./views/Calculator/CalculatorPersonal";
import CalculatorDelegated from "./views/Calculator/CalculatorDelegated";

import BasicProfile from "./views/SelfRegistration/BasicProfile";
import MilestoneSelection from "./views/SelfRegistration/MilestoneSelection";
import ProfileDetails from "./views/SelfRegistration/ProfileDetails";
import LSAAttendance from "./views/SelfRegistration/LSAAttendance";
import Award from "./views/SelfRegistration/Award";
import Supervisor from "./views/SelfRegistration/Supervisor";
import Confirmation from "./views/SelfRegistration/Confirmation";
import Splash from "./views/Splash";
import RegistrationHandler from "./views/SelfRegistration/RegistrationHandler";
import PanelHeader from "./views/SelfRegistration/PanelHeader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Splash /> },
      {
        path: "calculator",
        element: <CalculatorLanding />,
        children: [
          { path: "delegated", element: <CalculatorDelegated /> },
          { path: "personal", element: <CalculatorPersonal /> },
        ],
      },
      {
        path: "register",
        element: <PanelHeader />,
        children: [
          { path: "self", element: <RegistrationHandler /> },
          { path: "profile", element: <BasicProfile /> },
          { path: "milestone", element: <MilestoneSelection /> },
          { path: "details", element: <ProfileDetails /> },
          { path: "attendance", element: <LSAAttendance /> },
          { path: "award", element: <Award /> },
          { path: "supervisor", element: <Supervisor /> },
          { path: "confirmation", element: <Confirmation /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
