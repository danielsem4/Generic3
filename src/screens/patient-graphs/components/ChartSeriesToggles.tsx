import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";

export interface IChartSeries {
  key: string;
  label: string;
  color: string;
}

interface ChartSeriesTogglesProps {
  series: IChartSeries[];
  isHidden: (key: string) => boolean;
  onToggle: (key: string) => void;
}

interface SeriesToggleProps {
  series: IChartSeries;
  hidden: boolean;
  onToggle: (key: string) => void;
}

function SeriesToggle({ series, hidden, onToggle }: SeriesToggleProps) {
  const handleChange = () => onToggle(series.key);

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: series.color }}
      />
      <span className={hidden ? "text-muted-foreground line-through" : ""}>
        {series.label}
      </span>
      <Switch checked={!hidden} onCheckedChange={handleChange} />
    </label>
  );
}

export function ChartSeriesToggles({
  series,
  isHidden,
  onToggle,
}: ChartSeriesTogglesProps) {
  const { t } = useTranslation();

  if (series.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-xs font-medium text-muted-foreground">
        {t("graphs.seriesToggle")}
      </span>
      {series.map((s) => (
        <SeriesToggle
          key={s.key}
          series={s}
          hidden={isHidden(s.key)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
