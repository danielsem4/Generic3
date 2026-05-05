import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePatientMeasurementSubmissions } from "./hooks/usePatientMeasurementSubmissions";
import { usePatientMeasurementSettingsDialog } from "./hooks/usePatientMeasurementSettingsDialog";
import PatientMeasurementSettingsDialog from "./components/PatientMeasurementSettingsDialog";
import PatientMeasurementSubmissionsTable from "./components/PatientMeasurementSubTable";
import PatientMeasurementSubmissionsHeader from "./components/PatientMeasurementSubHeader";

export default function PatientMeasurementSubmissionsScreen() {
  const { t } = useTranslation();
  const location = useLocation();
  const { userId } = useParams<{ userId: string; clinicId: string }>();

  const measurementName =
    (location.state as { measurementName?: string } | null)?.measurementName ||
    t("patientMeasurements.submissions.measurementTitleFallback");

  const { submissions, isLoading, error } = usePatientMeasurementSubmissions();

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
    submitMeasurementSettings,
    isPending,
  } = usePatientMeasurementSettingsDialog();

  if (isLoading) {
    return <div className="p-6">{t("common.loading")}</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-destructive">
        {t("patientMeasurements.submissions.loadError")}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PatientMeasurementSubmissionsHeader
        userId={userId}
        measurementName={measurementName}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <PatientMeasurementSubmissionsTable submissions={submissions} />

      <PatientMeasurementSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        measurementName={measurementName}
        patientName={t("patientMeasurements.submissions.patientNameFallback")}
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
        onSubmit={() => submitMeasurementSettings()}
        isPending={isPending}
      />
    </div>
  );
}