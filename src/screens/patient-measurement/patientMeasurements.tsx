import { useTranslation } from "react-i18next";
import EntityHeader from "@/common/components/Patient+measurementPage/PatientHeader";
import { useMeasurementPage } from "./hooks/useMeasurementsPage";
import MeasurementSectionsCard from "./components/MeasurementSectionsCard";
import PatientEditDialog from "@/common/components/Patient+measurementPage/PatientEditDialog";

export default function MeasurementPage() {
  const { t } = useTranslation();
  const {
    patient,
    questionnaires,
    cognitiveTests,
    moduleQuestionnaires,
    isLoading,
    error,
  } = useMeasurementPage();

  if (isLoading) {
    return (
      <div className="p-10 text-center font-medium text-muted-foreground">
        {t("home.loading")}
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-10 text-center font-medium text-destructive">
        {t("home.error")}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <EntityHeader
       data={patient}
       renderActions={<PatientEditDialog patient={patient} />}
    />
      <MeasurementSectionsCard
        questionnaires={questionnaires}
        cognitiveTests={cognitiveTests}
        moduleQuestionnaires={moduleQuestionnaires}
      />
    </div>
  );
}