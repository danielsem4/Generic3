import { useTranslation } from "react-i18next";
import { useStatistics } from "./hooks/useStatistics";
import { StatisticsHeader } from "./components/StatisticsHeader";
import { MetricsCards } from "./components/MetricsCards";
import { ModuleMenu } from "./components/ModuleMenu";
import { ModuleChart } from "./components/ModuleChart";
import { ModuleDataTable } from "./components/ModuleDataTable";

export default function Statistics() {
  const { t } = useTranslation();
  const {
    totalDoctors,
    totalPatients,
    researchPatients,
    nonResearchPatients,
    modules,
    selectedModule,
    handleSelectModule,
    isLoading,
    error,
  } = useStatistics();

  if (isLoading) return <div className="p-8">{t("statistics.loading")}</div>;
  if (error) return <div className="p-8">{t("statistics.error")}</div>;

  return (
    <div className="p-8 flex flex-col gap-8">
      <StatisticsHeader />
      <MetricsCards
        totalDoctors={totalDoctors}
        totalPatients={totalPatients}
        researchPatients={researchPatients}
        nonResearchPatients={nonResearchPatients}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ModuleMenu
            modules={modules}
            selectedModuleId={selectedModule?.module_id ?? null}
            onSelect={handleSelectModule}
          />
        </div>
        <div className="lg:col-span-3 flex flex-col gap-6">
          {selectedModule && (
            <>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-4">
                  {selectedModule.module_name} {t("statistics.moduleStats")}
                </h3>
                <ModuleChart module={selectedModule} />
              </div>
              <ModuleDataTable dataPoints={selectedModule.data_points} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
