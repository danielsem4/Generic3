import { useTranslation } from "react-i18next";
import { MedicationSelector } from "./MedicationSelector";
import { Dosage } from "./Dosage";
import { FrequencyScheduleManager } from "@/common/components/patient-profile/FrequencyScheduleManager";
import { TimelineCard } from "@/common/components/TimelineCard";
import type { IMedicationHookData } from "../schema/patientMedicationsSchema";

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

      <FrequencyScheduleManager hookData={hookData} />
    </div>
  );
}