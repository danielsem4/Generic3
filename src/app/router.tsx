import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "@/features/auth";
import { VerifyCodePage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { SettingsPage } from "@/features/settings";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/verify",
    element: <VerifyCodePage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
]);
