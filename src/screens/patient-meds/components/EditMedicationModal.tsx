import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pill, Save } from "lucide-react";
import { useEditMedication } from "../hooks/useEditMedication";
import type { IPatientPrescription } from "@/common/types/Medication";
import { FullScreenFormModal } from "@/common/components/FullScreenFormModal";
import { TimelineCard } from "@/common/components/TimelineCard";
import { FrequencyScheduleManager } from "@/common/components/patient-profile/FrequencyScheduleManager";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface IEditMedicationModalProps {
  prescription: IPatientPrescription | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  patientId: string;
}

export function EditMedicationModal({
  prescription,
  isOpen,
  setIsOpen,
  patientId,
}: IEditMedicationModalProps) {
  const { t, i18n } = useTranslation();

  const {
    dosageAmount,
    setDosageAmount,
    dosageUnit,
    setDosageUnit,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    frequency,
    setFrequency,
    selectedDays,
    toggleDay,
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    dayOfMonth,
    setDayOfMonth,
    initForm,
    submitEdit,
    isPending,
  } = useEditMedication(patientId);

  useEffect(() => {
    if (isOpen && prescription) {
      initForm(prescription);
    }
  }, [isOpen, prescription, initForm]);

  const handleSave = () => {
    if (!prescription) return;

    submitEdit(prescription.id, {
      onSuccess: () => setIsOpen(false),
    });
  };

  if (!prescription) return null;

  const frequencyScheduleData = {
    frequency,
    setFrequency,
    selectedDays,
    toggleDay,
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    dayOfMonth,
    setDayOfMonth,
  };

  return (
    <FullScreenFormModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dir={i18n.dir()}
      icon={<Pill className="text-primary rotate-45" size={32} />}
      title={t("patientMeds.editPrescription")}
      cancelText={t("patientMeds.cancel")}
      finalizeButton={
       <LoadingButton
          onClick={handleSave}
          loading={isPending} 
          loadingText={t("common.loading.saving", "Saving...")} 
          className="min-w-[280px] h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center justify-center gap-3"
        >
          <Save size={22} />
          <span>{t("patientMeds.saveChanges")}</span>
        </LoadingButton>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("patientMeds.medicationLabel")}
          </span>

          <div className="h-11 px-4 flex items-center bg-muted/30 rounded-lg border border-border text-foreground font-bold uppercase tracking-tight">
            {prescription.med_name}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TimelineCard
            label={t("patientMeds.timelineLabel")}
            startDateLabel={t("patientMeds.startDate")}
            endDateLabel={t("patientMeds.endDate")}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          <div className="rounded-[2rem] border-none bg-card p-8 shadow-md space-y-5">
  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
    <Pill size={14} /> {t("patientMeds.dosageLabel")}
  </label>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-[11px] font-bold text-foreground mb-1">
        {t("patientMeds.amount")}
      </p>
      <input
        type="number"
        value={dosageAmount}
        onChange={(event) => setDosageAmount(event.target.value)}
        className="w-full h-14 bg-secondary rounded-xl px-4 outline-none border-none text-foreground"
      />
    </div>

    <div>
      <p className="text-[11px] font-bold text-foreground mb-1">
        {t("patientMeds.unit")}
      </p>
      <select
        value={dosageUnit}
        onChange={(event) => setDosageUnit(event.target.value)}
        className="w-full h-14 bg-secondary rounded-xl px-4 outline-none border-none text-foreground"
      >
        {["ml", "mg", "tabs"].map((unit) => (
          <option key={unit} value={unit}>
            {t(`patientMeds.units.${unit}`)}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>
        </div>

        <FrequencyScheduleManager hookData={frequencyScheduleData} />
      </div>
    </FullScreenFormModal>
  );
}