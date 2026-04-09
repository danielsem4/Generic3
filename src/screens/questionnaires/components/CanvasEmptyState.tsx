import { useTranslation } from "react-i18next";
import { MousePointerClick } from "lucide-react";

export function CanvasEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
      <MousePointerClick size={40} strokeWidth={1.5} />
      <p className="text-sm">{t("questionnaires.builder.emptyCanvas")}</p>
    </div>
  );
}
