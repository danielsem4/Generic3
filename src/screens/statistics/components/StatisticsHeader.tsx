import { BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function StatisticsHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <BarChart2 className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-2xl font-bold">{t("statistics.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("statistics.description")}
        </p>
      </div>
    </div>
  );
}
