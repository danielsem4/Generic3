import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePatientEvaluationSubmissions } from "./hooks/usePatientEvaluationSubmissions";
import { usePatientEvaluationSettingsDialog } from "./hooks/usePatientEvaluationSettingsDialog";
import PatientEvaluationSettingsDialog from "./components/PatientEvaluationSettingsDialog";
import PatientEvaluationSubmissionsTable from "./components/PatientEvaluationSubTable";
import PatientEvaluationSubmissionsHeader from "./components/PatientEvaluationSubHeader";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { useEffect, useState } from "react";

export default function PatientEvaluationSubmissionsScreen() {
  const { t } = useTranslation();
  const location = useLocation();
  const { userId } = useParams<{ userId: string; clinicId: string }>();

  // 🟢 סטייט פשוט ונקי לכניסה בלבד
  const [isScreenLoading, setIsScreenLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScreenLoading(false);
    }, 450); 
    return () => clearTimeout(timer);
  }, []);

  const evaluationName =
    (location.state as { evaluationName?: string } | null)?.evaluationName ||
    t("patientEvaluations.submissions.evaluationTitleFallback");

  const { submissions, isLoading, error, onDelete } = usePatientEvaluationSubmissions();

  const {
    isSettingsOpen,
    setIsSettingsOpen,
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
    submitEvaluationSettings,
    isPending,
  } = usePatientEvaluationSettingsDialog();
  
  // 🟢 ספינר ממורכז קבוע, תמיד באותו מיקום מושלם על כל המסך (בלי תלות ב-Layout)
  if (isLoading || isScreenLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
        <LoadingSpinner 
          title={t("common.loading.title", "Loading")} 
          description={t("common.loading.fetchData", "Fetching data...")} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-destructive">
        {t("patientEvaluations.submissions.loadError")}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PatientEvaluationSubmissionsHeader
        userId={userId}
        evaluationName={evaluationName}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <PatientEvaluationSubmissionsTable submissions={submissions} onDelete={onDelete} />

      <PatientEvaluationSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        evaluationName={evaluationName}
        patientName={t("patientEvaluations.submissions.patientNameFallback")}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        frequency={frequency}
        setFrequency={setFrequency}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        timeSlots={timeSlots}
        addTimeSlot={addTimeSlot}
        removeTimeSlot={removeTimeSlot}
        updateTimeSlot={updateTimeSlot}
        dayOfMonth={dayOfMonth}
        setDayOfMonth={setDayOfMonth}
        onSubmit={() => submitEvaluationSettings()}
        isPending={isPending}
      />
    </div>
  );
}