import { useTranslation } from "react-i18next";
import { ClipboardList, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullScreenFormModal } from "@/common/components/patient-profile/FullScreenFormModal";
import { TimelineCard } from "@/common/components/patient-profile/TimelineCard";
import { FrequencyScheduleManager } from "@/common/components/patient-profile/FrequencyScheduleManager";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  measurementName: string;
  patientName: string;

  // state
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;

  // frequency
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  setFrequency: (v: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY") => void;
  selectedDays: string[];
  toggleDay: (d: string) => void;
  timeSlots: string[];
  addTimeSlot: () => void;
  removeTimeSlot: (i: number) => void;
  updateTimeSlot: (i: number, v: string) => void;
  dayOfMonth: string;
  setDayOfMonth: (v: string) => void;

  onSubmit: () => void;
  isPending: boolean;
}

export default function PatientMeasurementSettingsDialog({
  open,
  onOpenChange,
  measurementName,
  patientName,
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
  onSubmit,
  isPending,
}: IProps) {
  const { t, i18n } = useTranslation();

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
      isOpen={open}
      setIsOpen={onOpenChange}
      dir={i18n.dir()}
      icon={<ClipboardList className="text-primary" size={32} />}
      title={t("patientMeasurements.settings.title")}
      cancelText={t("common.cancel")}
      finalizeButton={
        <Button
          onClick={onSubmit}
          disabled={isPending}
          className="min-w-[220px] h-12 rounded-2xl flex items-center gap-2"
        >
          <Send size={18} />
          {t("patientMeasurements.settings.sendToPatient")}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* header text */}
        <div>
          <p className="text-sm text-muted-foreground">
            {t("patientMeasurements.settings.subtitle", { name: patientName })}
          </p>
          <h2 className="text-2xl font-bold">{measurementName}</h2>
        </div>

        {/* main cards */}
        <div className="rounded-[28px] border border-border bg-card p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* timeline */}
            <TimelineCard
              label={t("patientMeasurements.settings.timelineLabel")}
              startDateLabel={t("patientMeasurements.settings.startDate")}
              endDateLabel={t("patientMeasurements.settings.endDate")}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />

            {/* frequency */}
            <FrequencyScheduleManager
              hookData={frequencyScheduleData}
              translationKey="patientMeasurements.settings"
            />
          </div>
        </div>
      </div>
    </FullScreenFormModal>
  );
}