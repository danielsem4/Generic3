import { useTranslation } from "react-i18next";
import EntityHeader from "@/common/components/Patient+evaluationPage/PatientHeader";
import { useEvaluationPage } from "./hooks/useEvaluationsPage";
import EvaluationSectionsCard from "./components/EvaluationSectionsCard";
import PatientEditDialog from "@/common/components/Patient+evaluationPage/PatientEditDialog";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";


export default function EvaluationPage() {
  const { t } = useTranslation();
  const {
    patient,
    questionnaires,
    cognitiveTests,
    moduleQuestionnaires,
    isLoading,
    error,
  } = useEvaluationPage();

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
      <div className="p-10 text-center font-medium text-destructive">
        {t("home.error")}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      < BackButton />
      <EntityHeader
       data={patient}
       renderActions={<PatientEditDialog patient={patient} />}
    />
      <EvaluationSectionsCard
        questionnaires={questionnaires}
        cognitiveTests={cognitiveTests}
        moduleQuestionnaires={moduleQuestionnaires}
      />
    </div>
  );
}