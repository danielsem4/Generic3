import type {
  IGraphOverlay,
  IGraphPoint,
  IMarkerCategory,
  IOverlaySeries,
  IRawDataPoint,
} from "@/common/types/graph";
import { transformGraphData } from "@/lib/transformGraphData";

// Distinct, high-contrast colors for overlay lines and marker categories.
export const OVERLAY_PALETTE = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export function colorForIndex(index: number): string {
  return OVERLAY_PALETTE[index % OVERLAY_PALETTE.length];
}

export interface IOverlayAnswer {
  date: string;
  value: string | number | boolean | string[] | null;
}

export interface IOverlayEvent {
  date: string;
}

// Turn any answer value into a stable display string; null/empty -> null (skip).
function stringifyValue(value: IOverlayAnswer["value"]): string | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    const joined = value.join(", ").trim();
    return joined === "" ? null : joined;
  }
  const text = String(value).trim();
  return text === "" ? null : text;
}

function byDate(a: { x: string | number }, b: { x: string | number }): number {
  const ad = Date.parse(String(a.x));
  const bd = Date.parse(String(b.x));
  if (!Number.isNaN(ad) && !Number.isNaN(bd)) return ad - bd;
  return String(a.x).localeCompare(String(b.x));
}

const emptySeries = (
  overlay: IGraphOverlay,
  label: string,
  color: string,
): IOverlaySeries => ({
  id: overlay.id,
  render: overlay.render,
  label,
  color,
  points: [],
  markersByCategory: [],
});

/**
 * Map a question overlay's answers into a renderable series.
 * LINE: numeric points (reusing the shared coercion) for an extra line.
 * MARKERS: one colored category per distinct answer value, each point placed
 * at the time the answer was submitted (e.g. yes/no/maybe -> 3 colors).
 */
export function mapAnswersToSeries(
  overlay: IGraphOverlay,
  answers: IOverlayAnswer[],
): IOverlaySeries {
  const label = overlay.label?.trim() || "";
  const baseColor = overlay.color || colorForIndex(0);

  if (overlay.render === "LINE") {
    const raw: IRawDataPoint[] = answers.map((a) => ({ x: a.date, y: a.value as IRawDataPoint["y"] }));
    return { ...emptySeries(overlay, label, baseColor), points: transformGraphData(raw) };
  }

  // MARKERS: group answer dates by distinct value, in order of first appearance.
  const datesByValue = new Map<string, string[]>();
  for (const answer of answers) {
    const text = stringifyValue(answer.value);
    if (text === null) continue;
    const dates = datesByValue.get(text) ?? [];
    dates.push(answer.date);
    datesByValue.set(text, dates);
  }

  // Each distinct value sits on its own Y band (1..n) and gets its own color.
  const markersByCategory: IMarkerCategory[] = [...datesByValue.entries()].map(
    ([value, dates], index) => ({
      label: value,
      color: colorForIndex(index),
      points: dates
        .map<IGraphPoint>((date) => ({ x: date, y: index + 1, yLabel: value }))
        .sort(byDate),
    }),
  );

  return { ...emptySeries(overlay, label, baseColor), markersByCategory };
}

export interface IChartSeriesKey {
  key: string;
  label: string;
  color: string;
}

export interface IChartModel {
  rows: Record<string, string | number | null>[];
  lines: IChartSeriesKey[]; // overlay LINE series (primary handled separately)
  markers: IChartSeriesKey[]; // one entry per marker category
  maxBand: number; // highest marker band level (for the hidden marker axis)
}

/**
 * Merge the primary points and all overlay series into a single, x-sorted row
 * set keyed by distinct x value, with one dataKey per series. recharts aligns
 * series by shared x while leaving gaps (null) where a series has no value.
 */
export function buildOverlayChartModel(
  primary: IGraphPoint[],
  overlaySeries: IOverlaySeries[],
): IChartModel {
  const rows = new Map<string, Record<string, string | number | null>>();
  const rowFor = (x: string | number) => {
    const id = String(x);
    let row = rows.get(id);
    if (!row) {
      row = { x };
      rows.set(id, row);
    }
    return row;
  };

  for (const point of primary) rowFor(point.x).y = point.y;

  const lines: IChartSeriesKey[] = [];
  const markers: IChartSeriesKey[] = [];
  let maxBand = 0;

  for (const series of overlaySeries) {
    if (series.render === "LINE") {
      const key = `line_${series.id}`;
      lines.push({ key, label: series.label, color: series.color });
      for (const point of series.points) rowFor(point.x)[key] = point.y;
      continue;
    }
    series.markersByCategory.forEach((category, index) => {
      const key = `mk_${series.id}_${index}`;
      markers.push({ key, label: category.label, color: category.color });
      for (const point of category.points) {
        rowFor(point.x)[key] = point.y;
        maxBand = Math.max(maxBand, point.y);
      }
    });
  }

  const sorted = [...rows.values()].sort((a, b) =>
    byDate({ x: a.x as string | number }, { x: b.x as string | number }),
  );
  return { rows: sorted, lines, markers, maxBand };
}

/**
 * Map module events (medication taken / activity done) into a single marker
 * category placed at each event's timestamp.
 */
export function mapEventsToMarkers(
  overlay: IGraphOverlay,
  events: IOverlayEvent[],
): IOverlaySeries {
  const label = overlay.label?.trim() || overlay.sourceName?.trim() || "";
  const color = overlay.color || colorForIndex(0);
  const points: IGraphPoint[] = events
    .map((e) => ({ x: e.date, y: 1, yLabel: label }))
    .sort(byDate);

  const markersByCategory: IMarkerCategory[] =
    points.length > 0 ? [{ label, color, points }] : [];

  return { ...emptySeries(overlay, label, color), markersByCategory };
}
