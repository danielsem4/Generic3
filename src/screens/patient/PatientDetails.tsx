import { usePatientDetails } from "./hooks/usePatient";
import PatientHeader from "./components/PatientHeader";
import PatientSectionsCard from "./components/PatientCards";

export default function PatientDetails() {
  const { patient, modules, metrics, functions } = usePatientDetails();

  return (
    <div className="p-6 space-y-6">
      <PatientHeader patient={patient} />
      <PatientSectionsCard
        functions={functions}
        metrics={metrics}
        modules={modules}
      />
    </div>
  );
}