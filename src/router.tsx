import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/screens/login/Login";
import VerifyCode from "@/screens/verify/VerifyCode";
import ClinicSelection from "@/screens/clinic-selection/ClinicSelection";
import Modules from "@/screens/modules/modules";
import ProtectedLayout from "@/common/components/layouts/ProtectedLayout";
import Settings from "@/screens/settings/Settings";
import NotFound from "@/screens/not-found/NotFound";
import Patients from "@/screens/patients/Patients";
import Medications from "@/screens/medications/Medications";
import ClinicManagers from "@/screens/clinic-managers/ClinicManagers";
import Doctors from "@/screens/doctors/Doctors";
import { useRole } from "@/hooks/common/useRole";
import { ROLE_HOME_PATH } from "@/common/types/Role";

function HomeRedirect() {
  const role = useRole();
  if (!role) return null;
  return <Navigate to={ROLE_HOME_PATH[role]} replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/verify", element: <VerifyCode /> },
  { path: "/clinic-selection", element: <ClinicSelection /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: "home", element: <HomeRedirect /> },
      { path: "clinic-managers", element: <ClinicManagers /> },
      { path: "doctors", element: <Doctors /> },
      { path: "modules", element: <Modules /> },
      { path: "settings", element: <Settings /> },
      { path: "patients", element: <Patients /> },
      { path: "medications", element: <Medications /> },
      { path: "modules/medications", element: <Medications /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);