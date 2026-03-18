import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface Props {
  onClose: () => void;
}

export function ClinicSuccessView({ onClose }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
      <CheckCircle2 className="w-16 h-16 text-primary" />
      <h2 className="text-2xl font-bold text-foreground">
        {t("clinicManagers.successTitle")}
      </h2>
      <p className="text-muted-foreground max-w-xs">
        {t("clinicManagers.successDesc")}
      </p>
      <Button
        onClick={onClose}
        className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8"
      >
        {t("clinicManagers.successClose")}
      </Button>
    </div>
  );
}
