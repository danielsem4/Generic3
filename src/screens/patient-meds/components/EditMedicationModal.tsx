import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pill, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMedication } from "../hooks/useEditMedication";
import type { IPatientPrescription } from "@/common/types/Medication";
import { FullScreenFormModal } from "@/common/components/FullScreenFormModal";
import { TimelineCard } from "@/common/components/TimelineCard";
import { FrequencyScheduleManager } from "@/common/components/patient-profile/FrequencyScheduleManager";

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
    dosage,
    setDosage,
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
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="min-w-[280px] h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center gap-3"
        >
          <Save size={22} />
          {t("patientMeds.saveChanges")}
        </Button>
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

          <div className="rounded-[2rem] border-none bg-card p-8 shadow-md space-y-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("patientMeds.dosageLabel")}
            </label>

            <input
              value={dosage}
              onChange={(event) => setDosage(event.target.value)}
              className="w-full h-12 bg-secondary rounded-xl px-4 outline-none border-none text-sm font-medium"
            />
          </div>
        </div>

        <FrequencyScheduleManager hookData={frequencyScheduleData} />
      </div>
    </FullScreenFormModal>
  );
}