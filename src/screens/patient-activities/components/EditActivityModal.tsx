import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Activity, Save} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IPatientActivity } from "@/common/types/activities";
import { useEditActivity } from "../hooks/useEditActivity";
import { FullScreenFormModal } from "@/common/components/FullScreenFormModal";
import { TimelineCard } from "@/common/components/TimelineCard";
import { ActivityFrequencyManager } from "./ActivityFrequencyManager";

interface IEditActivityModalProps {
  activity: IPatientActivity | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  patientId: string;
}

export function EditActivityModal({
  activity,
  isOpen,
  setIsOpen,
  patientId,
}: IEditActivityModalProps) {
  const { t, i18n } = useTranslation();
  const {
    startDate,setStartDate,
    endDate,setEndDate,
    frequency,setFrequency,
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
  } = useEditActivity(patientId);

  useEffect(() => {
    if (activity) initForm(activity);
  }, [activity]);

  const handleSave = () => {
    if (!activity) return;
    submitEdit(undefined, {
      onSuccess: () => setIsOpen(false),
    });
  };

  if (!activity) return null;


  return (
  <FullScreenFormModal
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    dir={i18n.dir()}
    icon={<Activity className="text-primary" size={32} />}
    title={t("patientActivities.editActivity.title")}
    cancelText={t("patientActivities.editActivity.cancel")}
    finalizeButton={
      <Button
        onClick={handleSave}
        disabled={isPending}
        className="min-w-[280px] h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center gap-3"
      >
        <Save size={22} />
        {t("patientActivities.editActivity.saveChanges")}
      </Button>
    }
  >
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t("patientActivities.editActivity.activityLabel")}
        </span>
        <div className="h-11 px-4 flex items-center bg-muted/30 rounded-lg border border-border text-foreground font-bold uppercase tracking-tight">
          {activity.activity_name}
        </div>
      </div>

      <TimelineCard
        label={t("patientActivities.editActivity.timelineLabel")}
        startDateLabel={t("patientActivities.editActivity.startDate")}
        endDateLabel={t("patientActivities.editActivity.endDate")}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <ActivityFrequencyManager
        hookData={{
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
        }}
      />
    </div>
  </FullScreenFormModal>
);
}