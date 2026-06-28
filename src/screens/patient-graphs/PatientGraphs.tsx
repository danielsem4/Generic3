import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { usePatientGraphs } from "./hooks/usePatientGraphs";
import { GraphDetail } from "./components/GraphDetail";

export default function PatientGraphs() {
  const { t } = useTranslation();
  const { graphs, selectedGraph, userId, clinicId, isLoading } =
    usePatientGraphs();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-6">
      <BackButton to={`/patients/${userId}`} className="self-start" />
      <h1 className="text-2xl font-black tracking-tight text-foreground">
        {t("graphs.patientTitle")}
      </h1>

      {isLoading ? (
        <LoadingSpinner
          title={t("common.loading.title")}
          description={t("common.loading.fetchData")}
        />
      ) : graphs.length === 0 || !selectedGraph ? (
        <p className="py-16 text-center text-muted-foreground">
          {t("graphs.empty")}
        </p>
      ) : (
        <div className="min-h-0 flex-1">
          <GraphDetail
            graph={selectedGraph}
            patientId={userId}
            clinicId={clinicId}
          />
        </div>
      )}
    </div>
  );
}
