import React, {type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { IMedicationHookData } from "../schema/patientMedicationsSchema";

export const DosageAndTimeline = ({ hookData }: { hookData: IMedicationHookData }) => {
  const { t } = useTranslation();

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => hookData.setStartDate(e.target.value);
  const handleEndChange = (e: ChangeEvent<HTMLInputElement>) => hookData.setEndDate(e.target.value);
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => hookData.setDosageAmount(e.target.value);
  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => hookData.setDosageUnit(e.target.value);

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Timeline Card */}
      <Card className="p-8 border-none shadow-md rounded-[2rem] space-y-5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
          <Clock size={14} /> {t("patientMeds.timelineLabel")}
        </label>
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.startDate")}</p>
          <Input type="date" value={hookData.startDate} onChange={handleStartChange} className="bg-secondary border-none h-14 rounded-xl" />
          <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.endDate")}</p>
          <Input type="date" value={hookData.endDate} onChange={handleEndChange} className="bg-secondary border-none h-14 rounded-xl" />
        </div>
      </Card>

      {/* Dosage Card */}
      <Card className="p-8 border-none shadow-md rounded-[2rem] space-y-5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
          <Pill size={14} /> {t("patientMeds.dosageLabel")}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.amount")}</p>
            <Input type="number" value={hookData.dosageAmount} onChange={handleAmountChange} className="h-14 bg-secondary border-none rounded-xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.unit")}</p>
            <select 
              value={hookData.dosageUnit} 
              onChange={handleUnitChange} 
              className="w-full h-14 bg-secondary rounded-xl px-4 outline-none border-none text-foreground"
            >
              {['ml', 'mg', 'tabs'].map(u => <option key={u} value={u}>{t(`patientMeds.units.${u}`)}</option>)}
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
};