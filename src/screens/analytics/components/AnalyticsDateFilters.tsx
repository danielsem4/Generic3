import { Input } from "@/components/ui/input";
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
        
         <Input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className="bg-secondary border-none h-12 rounded-xl text-sm font-medium text-foreground cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {t("analytics.filters.endDate")}
        </label>

        <Input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className="bg-secondary border-none h-12 rounded-xl text-sm font-medium text-foreground cursor-pointer"
        />
      </div>
    </div>
  );
}