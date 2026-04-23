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
import PatientMedications from "./screens/patient-meds/PatientMedications";
import ClinicManagers from "@/screens/clinic-managers/ClinicManagers";
import Doctors from "@/screens/doctors/Doctors";
import { useRole } from "@/hooks/common/useRole";
import { ROLE_HOME_PATH } from "@/common/types/Role";
import PatientDetails from "./screens/patient/PatientDetails";
import ClinicOverview from "./screens/clinic-overview/ClinicOverview";
import Statistics from "./screens/statistics/Statistics";
import Activities from "@/screens/activities/ActivitiesPage";
import MeasurementsPage from "@/screens/measurements/MeasurementsPage";
import MeasurementBuilder from "@/screens/measurements/MeasurementBuilder";
import PatientActivities from "./screens/patient-activities/PatientActivities";
import AssessmentResultsPage from "./screens/measutments-page/AssessmentResultsPage.tsx";

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
      { path: "patients/:userId", element: <PatientDetails /> },
      { path: "modules/medications", element: <Medications /> },
      { path: "modules/activities", element: <Activities /> },
      { path: "modules/measurements", element: <MeasurementsPage /> },
      { path: "modules/measurements/builder", element: <MeasurementBuilder /> },
      { path: "modules/measurements/builder/:id", element: <MeasurementBuilder /> },
      { path: "test-results", element: <AssessmentResultsPage /> },
      { path: "patients/:userId/medications", element: <PatientMedications /> },
      { path: "patients/:userId/activities", element: <PatientActivities /> },
      { path: "clinic", element: <ClinicOverview /> },
      { path: "statistics", element: <Statistics /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
