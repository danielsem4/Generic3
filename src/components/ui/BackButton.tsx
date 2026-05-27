import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";

interface BackButtonProps {
  to?: string;
  fallback?: number;
  className?: string;
  label?: string;
}

export const BackButton = ({
  to,
  fallback,
  className,
  label,
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const handleBackClick = () => {
    setIsNavigatingBack(true);

    setTimeout(() => {
      if (to) {
        navigate(to);
      } else if (fallback) {
        navigate(fallback);
      } else {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        pathSegments.pop();
        const parentPath = "/" + pathSegments.join("/");
        
        navigate(parentPath);
      }
    }, 350); 
  };

  if (isNavigatingBack) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
        <LoadingSpinner 
          title={t("common.loading.title", "Loading")} 
          description={t("common.loading.fetchData", "Fetching data...")} 
        />
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBackClick}
      className={`flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground transition-colors ${className ?? ""}`}
    >
      <ChevronLeft size={20} />
      <span className="text-sm font-medium">
        {label || t("common.back", "Back")}
      </span>
    </Button>
  );
};