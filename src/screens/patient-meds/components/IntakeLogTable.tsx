import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { usePatientMedications } from "../hooks/usePatientMedications";

export function IntakeLogTable() {
  const { t } = useTranslation();
  const { intakeLogs } = usePatientMedications("123");

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-10">
      <div className="p-4 flex justify-between items-center bg-muted/20 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Calendar className="text-muted-foreground" size={18} />
          <span>{t("patientMeds.intakeLogTitle")}</span>
        </div>
        <Button className="bg-primary text-primary-foreground hover:opacity-90 gap-2 h-9 px-4 text-xs transition-opacity shadow-sm">
          <RotateCcw size={14} /> {t("patientMeds.refreshData")}
        </Button>
      </div>

      <div className="p-3 grid grid-cols-6 gap-2 border-b border-border bg-muted/5 items-center text-xs text-left">
        <div className="flex justify-start"><Filter size={16} className="text-muted-foreground" /></div>
        <div className="flex items-center gap-2 col-span-2">
          <span className="text-muted-foreground">{t("patientMeds.filters.medication")}</span>
          <select className="h-8 w-full border border-border rounded-md px-2 bg-card text-foreground outline-none">
            <option>{t("patientMeds.filters.allMeds")}</option>
          </select>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <span className="text-muted-foreground">{t("patientMeds.filters.dateFrom")}</span>
          <Input className="h-8 text-xs bg-card border-border" value="2026/03/08" readOnly />
        </div>
      </div>

      <Table>
        <TableHeader className="bg-muted/10">
          <TableRow className="border-border">
            <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.intakeDate")}</TableHead>
            <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.intakeTime")}</TableHead>
            <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.medId")}</TableHead>
            <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.medName")}</TableHead>
            <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.form")}</TableHead>
            <TableHead className="text-left font-bold uppercase text-[10px]">{t("patientMeds.table.dosage")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px]">
          {intakeLogs.map((log, i) => (
            <TableRow key={i} className="hover:bg-muted/5 border-border transition-colors">
              <TableCell className="text-success font-bold">{log.intakeDate}</TableCell>
              <TableCell className="text-muted-foreground">{log.intakeTime}</TableCell>
              <TableCell className="text-muted-foreground">{log.medicineId}</TableCell>
              <TableCell className="font-bold text-foreground">{log.medName}</TableCell>
              <TableCell className="text-muted-foreground">{log.medForm || 'TAB'}</TableCell>
              <TableCell className="text-muted-foreground">{log.dosage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}