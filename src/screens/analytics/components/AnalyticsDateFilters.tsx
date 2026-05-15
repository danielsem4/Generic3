import { useTranslation } from "react-i18next";

interface AnalyticsDateFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function AnalyticsDateFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Readonly<AnalyticsDateFiltersProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {t("analytics.filters.startDate")}
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {t("analytics.filters.endDate")}
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}