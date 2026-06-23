import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AnalyticsChartCard } from "../components/AnalyticsChartCard";
import { AnalyticsDateFilters } from "../components/AnalyticsDateFilters";
import { AnalyticsSummaryCard } from "../components/AnalyticsSummaryCard";
import { getMeasurementsAnalytics } from "@/api/analyticsApi";
import { fillMissingDays } from "../utils/fillMissingDays";
import { useAuthStore } from "@/store/useAuthStore";
import { BackButton } from "@/components/ui/BackButton";

export default function MeasurementsAnalyticsPage() {
  const { t } = useTranslation();
  const clinicId = useAuthStore((state) => state.clinicId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analytics", "measurements", clinicId, startDate, endDate],
    queryFn: () => getMeasurementsAnalytics(clinicId!, startDate, endDate),
    enabled: !!clinicId,
  });

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold text-muted-foreground">
        {t("analytics.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-20 text-center font-bold text-destructive">
        {t("analytics.error")}
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold">{t("analytics.measurements.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("analytics.measurements.description")}</p>
          <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
        </div>
        <AnalyticsDateFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <AnalyticsSummaryCard
          label={t("analytics.measurements.summary.total")}
          value={summary?.total_submissions || 0}
        />
        <AnalyticsSummaryCard
          label={t("analytics.measurements.summary.mostUsed")}
          value={summary?.most_used || t("analytics.noData")}
          highlighted
        />
        <AnalyticsSummaryCard
          label={t("analytics.measurements.summary.types")}
          value={summary?.number_of_measurements || 0}
        />
      </div>

      <div className="grid gap-8">
        <AnalyticsChartCard
          title={t("analytics.measurements.usageChart")}
          data={usage}
        />
        <AnalyticsChartCard
          title={t("analytics.measurements.busiestDaysChart")}
          data={fillMissingDays(busiestDays, (day) => t(`analytics.days.${day}`))}
        />
      </div>
    </div>
  );
}
