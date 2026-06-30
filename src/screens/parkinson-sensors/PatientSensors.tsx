import { useTranslation } from "react-i18next";
import { Radio } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { usePatientSensors } from "./hooks/usePatientSensors";
import { SensorEventsTable } from "./components/SensorEventsTable";

export default function PatientSensors() {
  const { t } = useTranslation();
  const { data: events, isLoading, error } = usePatientSensors();

  if (isLoading) {
    return (
      <LoadingSpinner
        title={t("common.loading.title")}
        description={t("common.loading.fetchData")}
      />
    );
  }

  if (error) {
    return (
      <div className="p-20 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20 m-6">
        <h2 className="text-xl font-bold mb-2">
          {t("parkinsonSensors.patientView.error_title")}
        </h2>
        <p className="text-sm">
          {t("parkinsonSensors.patientView.error_desc")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <BackButton />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 text-left">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary shadow-sm">
              <Radio size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-foreground">
              {t("parkinsonSensors.title")}
            </h1>
          </div>
        </div>

        <main className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SensorEventsTable events={events} />
          </div>
        </main>
      </div>
    </div>
  );
}
