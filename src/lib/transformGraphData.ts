import type { IRawDataPoint, IGraphPoint } from "@/common/types/graph";

export interface ITransformOptions {
  // Optional explicit mapping of categorical labels to numbers
  // (e.g. derived from a question's option scores: { Mild: 1, Severe: 3 }).
  labelMap?: Record<string, number>;
}

function isNumericString(value: string): boolean {
  if (value.trim() === "") return false;
  return Number.isFinite(Number(value));
}

/**
 * Coerce a single raw y-value into a numeric value plottable on a chart,
 * preserving the original text as `yLabel` for ticks/tooltips.
 * Returns null for values that cannot/should not be plotted.
 * Categorical strings must already be present in `labelMap`.
 */
export function coerceY(
  value: IRawDataPoint["y"],
  labelMap: Record<string, number> = {},
): { y: number; yLabel: string } | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? { y: value, yLabel: String(value) } : null;
  }
  if (typeof value === "boolean") {
    return { y: value ? 1 : 0, yLabel: String(value) };
  }
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (isNumericString(trimmed)) return { y: Number(trimmed), yLabel: trimmed };
  if (trimmed in labelMap) return { y: labelMap[trimmed], yLabel: trimmed };
  return null;
}

function nextOrdinal(labelMap: Record<string, number>): number {
  const values = Object.values(labelMap);
  return values.length ? Math.max(...values) + 1 : 1;
}

function compareX(a: IGraphPoint, b: IGraphPoint): number {
  if (typeof a.x === "number" && typeof b.x === "number") return a.x - b.x;
  const ad = Date.parse(String(a.x));
  const bd = Date.parse(String(b.x));
  if (!Number.isNaN(ad) && !Number.isNaN(bd)) return ad - bd;
  return String(a.x).localeCompare(String(b.x));
}

/**
 * Transform raw backend coordinates into sorted, plottable points.
 * Unmapped categorical labels are assigned stable ordinals by first
 * appearance, continuing after any provided `labelMap` values.
 * Unplottable points (null/empty) are dropped.
 */
export function transformGraphData(
  raw: IRawDataPoint[],
  opts: ITransformOptions = {},
): IGraphPoint[] {
  const labelMap: Record<string, number> = { ...(opts.labelMap ?? {}) };
  let ordinal = nextOrdinal(labelMap);

  for (const point of raw) {
    const value = point.y;
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed === "" || isNumericString(trimmed) || trimmed in labelMap) {
      continue;
    }
    labelMap[trimmed] = ordinal;
    ordinal += 1;
  }

  const points: IGraphPoint[] = [];
  for (const point of raw) {
    const coerced = coerceY(point.y, labelMap);
    if (coerced === null) continue;
    points.push({ x: point.x, y: coerced.y, yLabel: coerced.yLabel });
  }

  points.sort(compareX);
  return points;
}
