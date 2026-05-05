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
import Statistics from "./screens/statistics/Statistics";
import Activities from "@/screens/activities/ActivitiesPage";
import MeasurementsPage from "@/screens/measurements/MeasurementsPage";
import MeasurementBuilder from "@/screens/measurements/MeasurementBuilder";
import PatientActivities from "./screens/patient-activities/PatientActivities";
import MeasurementPage from "./screens/patient-measurement/patientMeasurements";
import PatientMeasurementSubmissionsScreen from "./screens/patient-measurement-submissions/PatientMeasurementSubmissionsScreen";
import { AssessmentResultsPage } from "./screens/assesment/AssessmentResultsPage";
import { PatientFilesPage } from "@/screens/files/PatientFilesPage";


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
      { path: "modules/measurements", element: <MeasurementsPage /> },
      { path: "modules/measurements/builder", element: <MeasurementBuilder /> },
      { path: "modules/measurements/builder/:id", element: <MeasurementBuilder /> },
      { path: "patients/:userId/medications", element: <PatientMedications /> },
      { path: "patients/:userId/activities", element: <PatientActivities /> },
      { path: "patients/:userId/measurements", element: <MeasurementPage /> },
      { path: "patients/:userId/measurements/:measurementId/submissions", element: <PatientMeasurementSubmissionsScreen /> },
      { path: "patients/:userId/measurement-submissions/:submissionId", element: <AssessmentResultsPage /> },
      { path: "patients/:userId/files", element: <PatientFilesPage /> },
      { path: "clinic", element: <ClinicOverview /> },
      { path: "statistics", element: <Statistics /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
