import { createBrowserRouter } from "react-router-dom";
import Login from "@/screens/login/Login";
import VerifyCode from "@/screens/verify/VerifyCode";
import ClinicSelection from "@/screens/clinic-selection/ClinicSelection";
import Modules from "@/screens/modules/modules";
import ProtectedLayout from "@/common/components/layouts/ProtectedLayout";
import HomeRedirect from "@/common/components/HomeRedirect";
import Settings from "@/screens/settings/Settings";
import NotFound from "@/screens/not-found/NotFound";
import Patients from "@/screens/patients/Patients";
import Medications from "@/screens/medications/Medications";
import PatientMedications from "./screens/patient-meds/PatientMedications";
import ClinicManagers from "@/screens/clinic-managers/ClinicManagers";
import Doctors from "@/screens/doctors/Doctors";
import DoctorDetails from "@/screens/doctors/DoctorDetails";
import PatientDetails from "./screens/patient/PatientDetails";
import ClinicOverview from "./screens/clinic-overview/ClinicOverview";
import Analytics from "./screens/analytics/Analytics";
import Activities from "@/screens/activities/ActivitiesPage";
import EvaluationsPage from "@/screens/evaluations/EvaluationsPage";
import EvaluationBuilder from "@/screens/evaluations/EvaluationBuilder";
import PatientActivities from "./screens/patient-activities/PatientActivities";
import EvaluationPage from "./screens/patient-evaluation/patientEvaluations";
import PatientEvaluationSubmissionsScreen from "./screens/patient-evaluation-submissions/PatientEvaluationSubmissionsScreen";
import { AssessmentResultsPage } from "./screens/assesment/AssessmentResultsPage";
import { PatientFilesPage } from "@/screens/files/PatientFilesPage";
import MedicationsAnalyticsPage from "./screens/analytics/pages/MedicationsAnalyticsPage";
import ActivitiesAnalyticsPage from "./screens/analytics/pages/ActivitiesAnalyticsPage";
import EvaluationsAnalyticsPage from "./screens/analytics/pages/EvaluationsAnalyticsPage";


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
      { path: "doctors/:userId", element: <DoctorDetails /> },
      { path: "modules", element: <Modules /> },
      { path: "settings", element: <Settings /> },
      { path: "patients", element: <Patients /> },
      { path: "medications", element: <Medications /> },
      { path: "patients/:userId", element: <PatientDetails /> },
      { path: "modules/medications", element: <Medications /> },
      { path: "modules/activities", element: <Activities /> },
      { path: "modules/evaluations", element: <EvaluationsPage /> },
      { path: "modules/evaluations/builder", element: <EvaluationBuilder /> },
      { path: "modules/evaluations/builder/:id", element: <EvaluationBuilder /> },
      { path: "patients/:userId/medications", element: <PatientMedications /> },
      { path: "patients/:userId/activities", element: <PatientActivities /> },
      { path: "patients/:userId/evaluations", element: <EvaluationPage /> },
      { path: "patients/:userId/evaluations/:evaluationId/submissions", element: <PatientEvaluationSubmissionsScreen /> },
      { path: "patients/:userId/evaluation-submissions/:submissionId", element: <AssessmentResultsPage /> },
      { path: "patients/:userId/files", element: <PatientFilesPage /> },
      { path: "clinic", element: <ClinicOverview /> },
      { path: "analytics", element: <Analytics /> },
      { path : "analytics/activities", element: <ActivitiesAnalyticsPage/> },
      { path : "analytics/medications", element: <MedicationsAnalyticsPage /> },
      { path : "analytics/evaluations", element: <EvaluationsAnalyticsPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
