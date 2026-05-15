import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AnalyticsChartCard } from "../components/AnalyticsChartCard";
import { AnalyticsDateFilters } from "../components/AnalyticsDateFilters";
import {
  getActivitiesBusiestDays,
  getActivitiesUsage,
} from "@/api/analyticsApi";
import { fillMissingDays } from "../utils/fillMissingDays"; 
import { useAuthStore } from "@/store/useAuthStore";
import { BackButton } from "@/components/ui/BackButton";


export default function ActivitiesAnalyticsPage() {
  const { t } = useTranslation();
  const clinicId = useAuthStore((state) => state.clinicId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: usage = [],
    isLoading: isUsageLoading,
    error: usageError,
  } = useQuery({
    queryKey: ["analytics", "activities", "usage", clinicId, startDate, endDate],
    queryFn: () => getActivitiesUsage(clinicId!, startDate, endDate),
    enabled: !!clinicId,
  });

  const {
    data: busiestDays = [],
    isLoading: isBusiestDaysLoading,
    error: busiestDaysError,
  } = useQuery({
    queryKey: [
      "analytics",
      "activities",
      "busiest-days",
      clinicId,
      startDate,
      endDate,
    ],
    queryFn: () => getActivitiesBusiestDays(clinicId!, startDate, endDate),
    enabled: !!clinicId,
  });

  const isLoading = isUsageLoading || isBusiestDaysLoading;
  const error = usageError || busiestDaysError;

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 block w-full">
      <BackButton />
    </div>

          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
          <h1 className="text-xl font-semibold">
            {t("analytics.activities.title")}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {t("analytics.activities.description")}
          </p>

          <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
        </div>

        <AnalyticsDateFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      <div className="grid gap-6">
        <AnalyticsChartCard
          title={t("analytics.activities.usageChart")}
          data={usage}
        />

        <AnalyticsChartCard
          title={t("analytics.activities.busiestDaysChart")}
          data={fillMissingDays(busiestDays)}
        />
      </div>
    </div>
  );
}