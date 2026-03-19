import { useTranslation } from "react-i18next";
import { usePatientDetails } from "./hooks/usePatient";
import PatientHeader from "./components/PatientHeader";
import PatientSectionsCard from "./components/PatientCards";

export default function PatientDetails() {
  const { t } = useTranslation();
  const { patient, modules, metrics, functions, isLoading, error } = usePatientDetails();

  if (isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground font-medium">
        {t("home.loading")}
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-10 text-center text-destructive font-medium">
        {t("home.error")}
      </div>
    );
  }

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