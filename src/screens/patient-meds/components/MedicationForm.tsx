import React from "react";
import { MedicationSelector } from "./MedicationSelector";
import { Dosage } from "./Dosage";
import { FrequencyManager } from "./FrequencyManager";
import { TimelineCard } from "@/common/components/Patient-activities-meds/TimelineCard";
import type { IMedicationHookData } from "../schema/patientMedicationsSchema";
import { useTranslation } from "react-i18next";

export function MedicationForm({ hookData }: { hookData: IMedicationHookData }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 pb-4 text-left">
      <MedicationSelector hookData={hookData} />

    <div className="grid grid-cols-2 gap-8">
      <TimelineCard
         label={t("patientMeds.timelineLabel")}
         startDateLabel={t("patientMeds.startDate")}
         endDateLabel={t("patientMeds.endDate")}
         startDate={hookData.startDate}
         endDate={hookData.endDate}
         setStartDate={hookData.setStartDate}
         setEndDate={hookData.setEndDate}
      />

      <Dosage hookData={hookData} />
    </div>

      <FrequencyManager hookData={hookData} />
    </div>
  );
}