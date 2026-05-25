import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next"; 

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  title?: string;
  description?: string;
}

export function LoadingSpinner({
  fullScreen = false,
  title,
  description,
}: Readonly<LoadingSpinnerProps>) {
  const { t } = useTranslation(); 

  const containerClasses = fullScreen
    ? "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
    : "flex flex-col items-center justify-center py-20 w-full bg-transparent";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center max-w-sm text-center px-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground stroke-[1.5] mb-4" />

        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-1">
          {title ?? t("common.loading.title", "Processing your request")}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground max-w-[280px]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}