import clinicPlaceholder from "@/assets/clinic_placeholder.png";
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

interface IClinicImageProps {
  src?: string;
  alt: string;
  isResearch?: boolean;
}

export const ClinicImage = ({
  src,
  alt,
  isResearch,
}: IClinicImageProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full shrink-0 overflow-hidden md:w-2/5">
      <img
        src={src || clinicPlaceholder}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = clinicPlaceholder;
        }}
      />

      {isResearch && (
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <Activity className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-tight text-foreground">
            {t("clinic.researchFacility")}
          </span>
        </div>
      )}
    </div>
  );
};