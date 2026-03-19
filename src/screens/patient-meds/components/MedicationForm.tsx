import React from "react";
import { MedicationSelector } from "./MedicationSelector";
import { DosageAndTimeline } from "./DosageAndTimeline.tsx"; 
import { FrequencyManager } from "./FrequencyManager";
import type { IMedicationHookData } from "../schema/patientMedicationsSchema";

export function MedicationForm({ hookData }: { hookData: IMedicationHookData }) {
  return (
    <div className="space-y-8 pb-4 text-left">
      <MedicationSelector hookData={hookData} />
      
      <DosageAndTimeline hookData={hookData} />
      
      <FrequencyManager hookData={hookData} />
    </div>
  );
}