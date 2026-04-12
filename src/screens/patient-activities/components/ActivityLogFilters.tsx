import React from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { IActivityLogFilters, IPatientActivity } from "@/common/types/activities";

interface ActivityLogFiltersProps {
  filters: IActivityLogFilters;
  onFilterChange: (updated: Partial<IActivityLogFilters>) => void;
  activities: IPatientActivity[];
}

export function ActivityLogFilters({
  filters,
  onFilterChange,
  activities,
}: ActivityLogFiltersProps) {
  const { t } = useTranslation();

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ activity_name: e.target.value || undefined });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ start_date: e.target.value || undefined });
  };

  return (
    <div className="p-3 grid grid-cols-5 gap-2 border-b border-border bg-muted/5 items-center text-xs text-left">
      <div className="flex justify-start">
        <Filter size={16} className="text-muted-foreground" />
      </div>

      <div className="flex items-center gap-2 col-span-2">
        <span className="text-muted-foreground whitespace-nowrap">
          {t("patientActivities.filters.activity")}
        </span>
        <select
          value={filters.activity_name ?? ""}
          onChange={handleActivityChange}
          className="h-8 w-full border border-border rounded-md px-2 bg-card text-foreground outline-none"
        >
          <option value="">{t("patientActivities.filters.allActivities")}</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.activity_name}>
              {activity.activity_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 col-span-2">
        <span className="text-muted-foreground whitespace-nowrap">
          {t("patientActivities.filters.dateFrom")}
        </span>
        <Input
          type="date"
          value={filters.start_date ?? ""}
          onChange={handleStartDateChange}
          className="h-8 text-xs bg-card border-border"
        />
      </div>
    </div>
  );
}