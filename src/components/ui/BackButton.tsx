import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BackButtonProps {
  className?: string;
  label?: string; 
}

export const BackButton = ({ className, label }: BackButtonProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)} 
      className={`flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      <ChevronLeft size={20} />
      <span className="text-sm font-medium">
        {label || t("common.back", "Back")}
      </span>
    </Button>
  );
};