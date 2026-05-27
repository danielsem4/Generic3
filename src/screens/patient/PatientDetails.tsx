import { useTranslation } from "react-i18next";
import { usePatientDetails } from "./hooks/usePatient";
import PatientSectionsCard from "./components/PatientCards";
import EntityHeader from "@/common/components/Patient+measurementPage/PatientHeader";
import PatientEditDialog from "@/common/components/Patient+measurementPage/PatientEditDialog";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";


export default function PatientDetails() {
  const { t } = useTranslation();
  const { patient, modules, metrics, functions, isLoading, error } =
    usePatientDetails();

  if (isLoading) {
    return (
      <LoadingSpinner 
        title={t("common.loading.title")} 
        description={t("common.loading.fetchData")} 
      />
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
      <BackButton to="/patients" />
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
