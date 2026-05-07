import { useTranslation } from "react-i18next";
import { usePatientDetails } from "./hooks/usePatient";
import PatientSectionsCard from "./components/PatientCards";
import EntityHeader from "@/common/components/Patient+measurementPage/PatientHeader";
import PatientEditDialog from "@/common/components/Patient+measurementPage/PatientEditDialog";
import { BackButton } from "@/components/ui/BackButton";

export default function PatientDetails() {
  const { t } = useTranslation();
  const { patient, modules, metrics, functions, isLoading, error } =
    usePatientDetails();

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
      <BackButton />
      <EntityHeader
       data={patient}
       renderActions={<PatientEditDialog patient={patient} />}
      />
      <PatientSectionsCard
        functions={functions}
        metrics={metrics}
        modules={modules}
      />
    </div>
  );
}
