import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import type { IGraphPoint, IOverlaySeries } from "@/common/types/graph";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatDateTime } from "@/common/utils/formatDate";
import { buildOverlayChartModel } from "@/lib/overlaySeries";
import { useToggleSet } from "@/hooks/common/useToggleSet";
import {
  ChartSeriesToggles,
  type IChartSeries,
} from "./ChartSeriesToggles";

const COLOR = "#3b82f6";

interface GraphChartProps {
  points: IGraphPoint[];
  overlaySeries?: IOverlaySeries[];
  yLabel?: string;
}

export function GraphChart({ points, overlaySeries = [], yLabel }: GraphChartProps) {
  const { t } = useTranslation();
  const { isHidden, toggle } = useToggleSet();
  const model = buildOverlayChartModel(points, overlaySeries);

  const series: IChartSeries[] = [
    ...(points.length ? [{ key: "y", label: yLabel ?? "", color: COLOR }] : []),
    ...model.lines.map((l) => ({
      key: l.key,
      label: l.label || t("graphs.seriesUnnamed"),
      color: l.color,
    })),
    ...model.markers.map((m) => ({
      key: m.key,
      label: m.label || t("graphs.seriesUnnamed"),
      color: m.color,
    })),
  ];

  const yLabelMap = new Map(points.map((p) => [p.y, p.yLabel]));
  const formatY = (value: number) => yLabelMap.get(value) ?? String(value);
  const formatX = (value: string | number) =>
    typeof value === "string" ? formatDateTime(value) : String(value);

  const config: ChartConfig = { y: { label: yLabel, color: COLOR } };
  for (const line of model.lines) config[line.key] = { label: line.label, color: line.color };
  for (const marker of model.markers) config[marker.key] = { label: marker.label, color: marker.color };

  // Categorical data maps labels to ordinals (e.g. On->1, Off->2). Without an
  // explicit tick set the numeric Y scale interpolates ticks like 1.5 that have
  // no label, so constrain ticks to the real values when categorical.
  const isCategorical = points.some((p) => p.yLabel !== String(p.y));
  const yTicks = [...new Set(points.map((p) => p.y))].sort((a, b) => a - b);
  const yDomain: [number, number] | undefined =
    isCategorical && yTicks.length
      ? [yTicks[0] - 0.5, yTicks[yTicks.length - 1] + 0.5]
      : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <ChartSeriesToggles series={series} isHidden={isHidden} onToggle={toggle} />
      <div className="min-h-0 flex-1">
        <ChartContainer config={config} className="h-full min-h-0 w-full">
          <ComposedChart data={model.rows}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              tickFormatter={formatX}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              tickFormatter={formatY}
              ticks={isCategorical ? yTicks : undefined}
              domain={yDomain}
              interval={isCategorical ? 0 : undefined}
            />
            {model.markers.length > 0 && (
              <YAxis yAxisId="markers" hide domain={[0, model.maxBand + 1]} />
            )}
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={formatX} />}
            />
            <Line
              dataKey="y"
              stroke={COLOR}
              dot
              strokeWidth={2}
              connectNulls
              hide={isHidden("y")}
            />
            {model.lines.map((line) => (
              <Line
                key={line.key}
                dataKey={line.key}
                stroke={line.color}
                dot
                strokeWidth={2}
                connectNulls
                hide={isHidden(line.key)}
              />
            ))}
            {model.markers.map((marker) => (
              <Scatter
                key={marker.key}
                yAxisId="markers"
                dataKey={marker.key}
                fill={marker.color}
                hide={isHidden(marker.key)}
              />
            ))}
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  );
}
