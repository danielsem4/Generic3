import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AnalyticsChartCard } from "../components/AnalyticsChartCard";
import { AnalyticsDateFilters } from "../components/AnalyticsDateFilters";
import { getEvaluationsAnalytics } from "@/api/analyticsApi";
import { fillMissingDays } from "../utils/fillMissingDays"; 
import { useAuthStore } from "@/store/useAuthStore";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";

export default function EvaluationsAnalyticsPage() {
  const { t } = useTranslation();
  const clinicId = useAuthStore((state) => state.clinicId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: analyticsData,
    isLoading,
  } = useQuery({
    queryKey: ["analytics", "evaluations", clinicId, startDate, endDate],
    queryFn: () => getEvaluationsAnalytics(clinicId!, startDate, endDate),
    enabled: !!clinicId,
  });

  const summary = analyticsData?.summary;
  const usage = analyticsData?.usage ?? [];
  const busiestDays = analyticsData?.busiest_days ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 block w-full">
        <BackButton />
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{t("analytics.evaluations.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("analytics.evaluations.description")}</p>
          <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
        </div>
        <AnalyticsDateFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {isLoading ? (
        <div className="mt-20 flex justify-center items-center w-full">
          <LoadingSpinner 
            title={t("common.loading.title")} 
            description={t("common.loading.fetchData")} 
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("analytics.evaluations.summary.total")}
              </p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{summary?.total_submissions || 0}</h3>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm border-l-4 border-l-primary">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("analytics.evaluations.summary.mostUsed")}
              </p>
              <h3 className="text-xl font-bold mt-2 text-foreground truncate">
                {summary?.most_used || t("analytics.noData")}
              </h3>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("analytics.evaluations.summary.types")}
              </p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{summary?.number_of_evaluations || 0}</h3>
            </div>
          </div>

          <div className="grid gap-8">
            <AnalyticsChartCard title={t("analytics.evaluations.usageChart")} data={usage} />
            <AnalyticsChartCard title={t("analytics.evaluations.busiestDaysChart")} data={fillMissingDays(busiestDays)} />
          </div>
        </>
      )}
    </div>
  );
}