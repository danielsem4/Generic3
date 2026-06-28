import { useTranslation } from "react-i18next";
import type { IOverlaySeries } from "@/common/types/graph";
import type { ILegendEntry } from "../hooks/useGraphChartData";

interface GraphExplanationProps {
  description?: string;
  xLabel?: string;
  yLabel?: string;
  legend: ILegendEntry[];
  overlaySeries?: IOverlaySeries[];
}

interface IOverlayLegendItem {
  key: string;
  label: string;
  color: string;
}

function toOverlayLegend(series: IOverlaySeries[]): IOverlayLegendItem[] {
  const items: IOverlayLegendItem[] = [];
  for (const s of series) {
    if (s.render === "LINE") {
      if (s.points.length > 0) {
        items.push({ key: s.id, label: s.label, color: s.color });
      }
      continue;
    }
    s.markersByCategory.forEach((category, index) => {
      if (category.points.length === 0) return;
      const name = s.label ? `${s.label}: ${category.label}` : category.label;
      items.push({ key: `${s.id}-${index}`, label: name, color: category.color });
    });
  }
  return items;
}

export function GraphExplanation({
  description,
  xLabel,
  yLabel,
  legend,
  overlaySeries = [],
}: GraphExplanationProps) {
  const { t } = useTranslation();
  const overlayLegend = toOverlayLegend(overlaySeries);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {description && (
        <span className="max-w-md truncate" title={description}>
          {description}
        </span>
      )}

      {xLabel && (
        <span>
          <span className="font-medium text-foreground">
            {t("graphs.xAxisLabel")}:
          </span>{" "}
          {xLabel}
        </span>
      )}

      {yLabel && (
        <span>
          <span className="font-medium text-foreground">
            {t("graphs.yAxisLabel")}:
          </span>{" "}
          {yLabel}
        </span>
      )}

      {legend.map((entry) => (
        <span key={entry.value} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full bg-[#3b82f6]"
          />
          <span className="font-medium text-foreground">{entry.label}</span>
          <span>({entry.value})</span>
        </span>
      ))}

      {overlayLegend.map((item) => (
        <span key={item.key} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium text-foreground">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
