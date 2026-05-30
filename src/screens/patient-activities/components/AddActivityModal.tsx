import React from "react";
import { useTranslation } from "react-i18next";
import { Activity, CheckCircle2 } from "lucide-react";
import { ActivitySelector } from "./ActivitySelector";
import { usePatientActivities } from "../hooks/usePatientActivities";
import { useAddActivity } from "../hooks/useAddActivity";
import { FullScreenFormModal } from "@/common/components/FullScreenFormModal";
import { TimelineCard } from "@/common/components/TimelineCard";
import { FrequencyScheduleManager } from "@/common/components/patient-profile/FrequencyScheduleManager";
import { LoadingButton } from "@/components/ui/LoadingButton";

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
       <LoadingButton
          onClick={handleFinalizeAction}
          disabled={!addActivityData.selectedActivity}
          loading={addActivityData.isAddPending} 
          loadingText={t("common.loading.adding", "Adding...")}
          className="min-w-[320px] h-16 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center justify-center gap-3"
        >
          <CheckCircle2 size={24} />
          <span>{t("patientActivities.addActivity.finalize")}</span>
        </LoadingButton>
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
      <FrequencyScheduleManager
       hookData={addActivityData}
      />
    </FullScreenFormModal>
  );
}