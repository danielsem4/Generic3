import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import type { IGraphPoint } from "@/common/types/graph";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatDate } from "@/common/utils/formatDate";

const COLOR = "#3b82f6";

interface GraphChartProps {
  points: IGraphPoint[];
  yLabel?: string;
}

export function GraphChart({ points, yLabel }: GraphChartProps) {
  const yLabelMap = new Map(points.map((p) => [p.y, p.yLabel]));
  const formatY = (value: number) => yLabelMap.get(value) ?? String(value);
  const formatX = (value: string | number) =>
    typeof value === "string" ? formatDate(value) : String(value);
  const config: ChartConfig = {
    y: { label: yLabel, color: COLOR },
  };

  return (
    <ChartContainer config={config} className="h-72 w-full">
      <LineChart data={points}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="x"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatX}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatY}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="y" stroke={COLOR} dot strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  );
}
