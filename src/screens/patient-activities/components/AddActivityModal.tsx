import React from "react";
import { useTranslation } from "react-i18next";
import { Activity, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivitySelector } from "./ActivitySelector";
import { usePatientActivities } from "../hooks/usePatientActivities";
import { useAddActivity } from "../hooks/useAddActivity";
import { FullScreenFormModal } from "@/common/components/Patient-activities-meds/FullScreenFormModal";
import { TimelineCard } from "@/common/components/Patient-activities-meds/TimelineCard";
import { ActivityFrequencyManager } from "./ActivityFrequencyManager";

interface IAddActivityModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
  clinicId: string;
}

export function AddActivityModal({
  isOpen,
  setIsOpen,
  userId,
  clinicId,
}: IAddActivityModalProps) {
  const { t, i18n } = useTranslation();

  const patientActivitiesData = usePatientActivities(clinicId, userId);
  const addActivityData = useAddActivity(clinicId, userId);

  const handleFinalizeAction = () => {
    addActivityData.handleFinalize(() => setIsOpen(false));
  };

  return (
    <FullScreenFormModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dir={i18n.dir()}
      icon={<Activity className="text-primary" size={32} />}
      title={t("patientActivities.addActivity.newActivity")}
      cancelText={t("patientActivities.addActivity.cancel")}
      finalizeButton={
        <Button
          onClick={handleFinalizeAction}
          disabled={!addActivityData.selectedActivity || addActivityData.isAddPending}
          className="min-w-[320px] h-16 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center gap-3"
        >
          <CheckCircle2 size={24} />
          {t("patientActivities.addActivity.finalize")}
        </Button>
      }
    >
      <ActivitySelector
        activities={patientActivitiesData.clinicActivities}
        selectedActivity={addActivityData.selectedActivity}
        setSelectedActivity={addActivityData.setSelectedActivity}
      />

      <TimelineCard
        label={t("patientActivities.addActivity.timelineLabel")}
        startDateLabel={t("patientActivities.addActivity.startDate")}
        endDateLabel={t("patientActivities.addActivity.endDate")}
        startDate={addActivityData.startDate}
        endDate={addActivityData.endDate}
        setStartDate={addActivityData.setStartDate}
        setEndDate={addActivityData.setEndDate}
      />

      <ActivityFrequencyManager
        hookData={{
          frequency: addActivityData.frequency,
          setFrequency: addActivityData.setFrequency,
          selectedDays: addActivityData.selectedDays,
          toggleDay: addActivityData.toggleDay,
          timeSlots: addActivityData.timeSlots,
          addTimeSlot: addActivityData.addTimeSlot,
          removeTimeSlot: addActivityData.removeTimeSlot,
          updateTimeSlot: addActivityData.updateTimeSlot,
          dayOfMonth: addActivityData.dayOfMonth,
          setDayOfMonth: addActivityData.setDayOfMonth,
        }}
      />
    </FullScreenFormModal>
  );
}