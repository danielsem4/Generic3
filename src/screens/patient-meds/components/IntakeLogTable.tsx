import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { IIntakeLog, IMedicationLogFilters } from "../schema/patientMedicationsSchema";
import type { IPatientPrescription } from "@/common/types/Medication";
import { formatDate } from "@/common/utils/formatDate";
import { formatTime } from "@/common/utils/formatTime";

interface IntakeLogRowProps {
  log: IIntakeLog;
}

const IntakeLogRow: React.FC<IntakeLogRowProps> = ({ log }) => {
  const date = formatDate(log.taken_at);
  const time = formatTime(log.taken_at);

  return (
    <TableRow className="hover:bg-muted/5 border-border transition-colors">
      <TableCell className="text-success font-bold">{date}</TableCell>
      <TableCell className="text-muted-foreground">{time}</TableCell>
      <TableCell className="font-bold text-foreground">{log.med_name}</TableCell>
      <TableCell className="text-muted-foreground">{log.dosage_taken}</TableCell>
      <TableCell className="text-muted-foreground">{log.status}</TableCell>
    </TableRow>
  );
};

interface IntakeLogTableProps {
  intakeLogs: IIntakeLog[];
  filters: IMedicationLogFilters;
  onFilterChange: (updated: Partial<IMedicationLogFilters>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  prescriptions: IPatientPrescription[];
}

export function IntakeLogTable({ intakeLogs, filters, onFilterChange, onResetFilters, onRefresh, prescriptions }: IntakeLogTableProps) {
  const { t } = useTranslation();

  const handleMedicationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ med_name: e.target.value || undefined });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ start_date: e.target.value || undefined });
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-10">
      <div className="p-4 flex justify-between items-center bg-muted/20 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Calendar className="text-muted-foreground" size={18} />
          <span>{t("patientMeds.intakeLogTitle")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("patientMeds.resetFilters")}
          </Button>
          <Button
            onClick={onRefresh}
            className="bg-primary text-primary-foreground hover:opacity-90 gap-2 h-9 px-4 text-xs transition-opacity shadow-sm"
          >
            <RotateCcw size={14} /> {t("patientMeds.refreshData")}
          </Button>
        </div>
      </div>

      <div className="p-3 grid grid-cols-5 gap-2 border-b border-border bg-muted/5 items-center text-xs text-left">
        <div className="flex justify-start"><Filter size={16} className="text-muted-foreground" /></div>
        <div className="flex items-center gap-2 col-span-2">
          <span className="text-muted-foreground whitespace-nowrap">{t("patientMeds.filters.medication")}</span>
          <select
            value={filters.med_name ?? ""}
            onChange={handleMedicationChange}
            className="h-8 w-full border border-border rounded-md px-2 bg-card text-foreground outline-none"
          >
            <option value="">{t("patientMeds.filters.allMeds")}</option>
            {prescriptions.map((p) => (
              <option key={p.id} value={p.med_name}>
                {p.med_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <span className="text-muted-foreground whitespace-nowrap">{t("patientMeds.filters.dateFrom")}</span>
          <Input
            type="date"
            value={filters.start_date ?? ""}
            onChange={handleStartDateChange}
            className="h-8 text-xs bg-card border-border"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[420px]">
        <Table>
          <TableHeader className="bg-muted/10 sticky top-0 z-10">
            <TableRow className="border-border">
              <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.intakeDate")}</TableHead>
              <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.intakeTime")}</TableHead>
              <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.medName")}</TableHead>
              <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.dosage")}</TableHead>
              <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[12px]">
            {intakeLogs.map((log) => (
              <IntakeLogRow key={log.id} log={log} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
