import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IClinicOption } from "@/api/authApi";
import logo from "@/assets/app_logo.png";

interface ClinicButtonProps {
  clinic: IClinicOption;
  onSelect: (id: string) => void;
  disabled: boolean;
}

function ClinicButton({ clinic, onSelect, disabled }: ClinicButtonProps) {
  const handleClick = () => onSelect(clinic.id);
  return (
    <Button
      key={clinic.id}
      variant="outline"
      disabled={disabled}
      onClick={handleClick}
      className="flex items-center gap-3 h-14 px-4 justify-start rounded-full"
    >
      {clinic.clinic_image_url ? (
        <img
          src={clinic.clinic_image_url}
          alt={clinic.clinic_name}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-medium">
          {clinic.clinic_name.charAt(0)}
        </div>
      )}
      <span className="truncate">{clinic.clinic_name}</span>
    </Button>
  );
}

interface ClinicSelectionCardProps {
  clinics: IClinicOption[];
  isClinicPending: boolean;
  onSelect: (clinicId: string) => void;
}

export function ClinicSelectionCard({ clinics, isClinicPending, onSelect }: ClinicSelectionCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md py-0">
      <CardContent className="pt-8 pb-8 px-8">
        <div className="flex flex-col items-center mb-8 gap-2">
          <img src={logo} alt="Logo" className="w-[120px]" />
          <p className="text-lg font-semibold text-foreground">{t("login.selectClinic")}</p>
          <p className="text-sm text-muted-foreground">{t("login.selectClinicDesc")}</p>
        </div>
        <div className="flex flex-col gap-3">
          {clinics.map((clinic) => (
            <ClinicButton
              key={clinic.id}
              clinic={clinic}
              onSelect={onSelect}
              disabled={isClinicPending}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
