import { createBrowserRouter } from "react-router-dom";
import Login from "@/screens/login/Login";
import VerifyCode from "@/screens/verify/VerifyCode";
import Home from "@/screens/home/Home";
import Modules from "@/screens/modules/modules";
import ProtectedLayout from "@/common/components/layouts/ProtectedLayout";
import Settings from "@/screens/settings/Settings";
import NotFound from "@/screens/not-found/NotFound";
import Patients from "@/screens/patients/Patients";
import Medications from "@/screens/medications/Medications";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/verify", element: <VerifyCode /> },

  {
    element: <ProtectedLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "modules", element: <Modules /> },
      { path: "settings", element: <Settings /> },
      { path: "patients", element: <Patients /> },
      { path: "medications", element: <Medications /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
