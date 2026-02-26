import { createBrowserRouter,Navigate } from "react-router-dom";
import Login from "@/screens/login/Login";
import VerifyCode from "@/screens/verify/VerifyCode";
import Home from "@/screens/home/Home";
import Modules from "@/screens/modules/modules";
import ProtectedLayout from "@/common/components/layouts/ProtectedLayout";
import Settings from "@/screens/settings/Settings";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/verify", element: <VerifyCode /> },

  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> }, 
      { path: "home", element: <Home /> },
      { path: "modules", element: <Modules /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);