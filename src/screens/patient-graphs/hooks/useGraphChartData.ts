import { transformGraphData } from "@/lib/transformGraphData";
import { useGraphData } from "./useGraphData";

export interface ILegendEntry {
  value: number;
  label: string;
}

export function useGraphChartData(
  graphId: string,
  patientId: string | undefined,
  clinicId: string | null,
) {
  const { data, isLoading } = useGraphData(graphId, patientId, clinicId);
  const points = transformGraphData(data?.points ?? []);

  // Only categorical mappings (where the label differs from the numeric value)
  // form a meaningful legend, e.g. 1 -> "Mild".
  const seen = new Map<number, string>();
  for (const point of points) {
    if (String(point.y) !== point.yLabel && !seen.has(point.y)) {
      seen.set(point.y, point.yLabel);
    }
  }
  const legend: ILegendEntry[] = [...seen.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.value - b.value);

  return {
    isLoading,
    points,
    xLabel: data?.xLabel,
    yLabel: data?.yLabel,
    legend,
  };
}
