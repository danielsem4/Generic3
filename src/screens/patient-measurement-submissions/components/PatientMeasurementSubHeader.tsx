import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/ui/BackButton"; 

interface Props {
  userId?: string;
  measurementName: string;
  onOpenSettings: () => void;
}

export default function PatientMeasurementSubmissionsHeader({
  userId,
  measurementName,
  onOpenSettings,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <BackButton 
        to={`/patients/${userId}/measurements`} 
        label={t("patientMeasurements.submissions.backToMeasurements")}
        className="p-0 h-auto hover:bg-transparent text-sm text-muted-foreground hover:text-foreground"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{measurementName}</h1>
          <p className="text-sm text-muted-foreground">
            {t("patientMeasurements.submissions.pageDescription")}
          </p>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4" />
          {t("patientMeasurements.submissions.settingsButton")}
        </Button>
      </div>
    </>
  );
}