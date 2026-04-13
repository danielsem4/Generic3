import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, RotateCcw} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { IActivityLog, IActivityLogFilters, IPatientActivity} from "@/common/types/activities";
import { ActivityLogFilters } from "./ActivityLogFilters";
interface ActivityLogRowProps {
  log: IActivityLog;
}

const ActivityLogRow: React.FC<ActivityLogRowProps> = ({ log }) => {
  const [date, time] = log.time_done.split("T");
  const formattedTime = time?.slice(0, 5) ?? "";

  return (
    <TableRow className="hover:bg-muted/5 border-border transition-colors">
      <TableCell className="font-bold text-foreground">{log.activity_name}</TableCell>
      <TableCell className="text-success font-bold">{date}</TableCell>
      <TableCell className="text-muted-foreground">{formattedTime}</TableCell>
    </TableRow>
  );
};

interface ActivityLogTableProps {
  activityLogs: IActivityLog[];
  filters: IActivityLogFilters;
  onFilterChange: (updated: Partial<IActivityLogFilters>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  activities: IPatientActivity[];
}

export function ActivityLogTable({
  activityLogs,
  filters,
  onFilterChange,
  onResetFilters,
  onRefresh,
  activities,
}: ActivityLogTableProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-10">
      <div className="p-4 flex justify-between items-center bg-muted/20 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Calendar className="text-muted-foreground" size={18} />
          <span>{t("patientActivities.logTitle")}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("patientActivities.resetFilters")}
          </Button>

          <Button
            onClick={onRefresh}
            className="bg-primary text-primary-foreground hover:opacity-90 gap-2 h-9 px-4 text-xs transition-opacity shadow-sm"
          >
            <RotateCcw size={14} /> {t("patientActivities.refreshData")}
          </Button>
        </div>
      </div>

      <ActivityLogFilters
        filters={filters}
        onFilterChange={onFilterChange}
         activities={activities}
      />

      <div className="overflow-y-auto max-h-[420px]">
        <Table>
          <TableHeader className="bg-muted/10 sticky top-0 z-10">
            <TableRow className="border-border">
              <TableHead className="text-left font-bold uppercase text-[10px]">
                {t("patientActivities.table.activityName")}
              </TableHead>
              <TableHead className="text-left font-bold uppercase text-[10px]">
                {t("patientActivities.table.date")}
              </TableHead>
              <TableHead className="text-left font-bold uppercase text-[10px]">
                {t("patientActivities.table.time")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[12px]">
            {activityLogs.map((log) => (
              <ActivityLogRow key={log.id} log={log} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}