import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { usePatientGraphs } from "./hooks/usePatientGraphs";
import { GraphDetail } from "./components/GraphDetail";
import { GraphListItem } from "./components/GraphListItem";

export default function PatientGraphs() {
  const { t } = useTranslation();
  const {
    graphs,
    selectedGraph,
    selectedGraphId,
    handleSelect,
    userId,
    clinicId,
    isLoading,
  } = usePatientGraphs();

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <BackButton to={`/patients/${userId}`} />
      <h1 className="text-2xl font-black tracking-tight text-foreground">
        {t("graphs.patientTitle")}
      </h1>

      {isLoading ? (
        <LoadingSpinner
          title={t("common.loading.title")}
          description={t("common.loading.fetchData")}
        />
      ) : graphs.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {t("graphs.empty")}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
          <nav className="space-y-2">
            <h2 className="px-1 text-sm font-semibold text-muted-foreground">
              {t("graphs.availableCharts")}
            </h2>
            {graphs.map((graph) => (
              <GraphListItem
                key={graph.id}
                graph={graph}
                isSelected={graph.id === selectedGraphId}
                onSelect={handleSelect}
              />
            ))}
          </nav>

          {selectedGraph && (
            <GraphDetail
              graph={selectedGraph}
              patientId={userId}
              clinicId={clinicId}
            />
          )}
        </div>
      )}
    </div>
  );
}
