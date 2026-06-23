import { useTranslation } from "react-i18next";
import type { ILegendEntry } from "../hooks/useGraphChartData";

interface GraphExplanationProps {
  description?: string;
  xLabel?: string;
  yLabel?: string;
  legend: ILegendEntry[];
}

export function GraphExplanation({
  description,
  xLabel,
  yLabel,
  legend,
}: GraphExplanationProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
      <h3 className="font-semibold text-foreground">{t("graphs.aboutChart")}</h3>

      <p className="text-muted-foreground">
        {description || t("graphs.noDescription")}
      </p>

      <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {xLabel && (
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">
              {t("graphs.xAxisLabel")}:
            </dt>
            <dd className="text-muted-foreground">{xLabel}</dd>
          </div>
        )}
        {yLabel && (
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">
              {t("graphs.yAxisLabel")}:
            </dt>
            <dd className="text-muted-foreground">{yLabel}</dd>
          </div>
        )}
      </dl>

      {legend.length > 0 && (
        <div className="space-y-1">
          <h4 className="font-medium text-foreground">
            {t("graphs.valueLegend")}
          </h4>
          <ul className="space-y-0.5 text-muted-foreground">
            {legend.map((entry) => (
              <li key={entry.value}>
                {entry.value} → {entry.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
