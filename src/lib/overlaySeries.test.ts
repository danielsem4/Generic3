import { describe, it, expect } from "vitest";
import type { IGraphOverlay } from "@/common/types/graph";
import {
  OVERLAY_PALETTE,
  buildOverlayChartModel,
  colorForIndex,
  mapAnswersToSeries,
  mapEventsToMarkers,
} from "./overlaySeries";

const questionOverlay = (render: "LINE" | "MARKERS"): IGraphOverlay => ({
  id: "o1",
  type: "QUESTION",
  render,
  evaluationId: "e1",
  elementId: "q1",
  label: "Mood",
});

const moduleOverlay = (): IGraphOverlay => ({
  id: "o2",
  type: "MEDICATION",
  render: "MARKERS",
  sourceName: "Aspirin",
  color: "#123456",
});

describe("colorForIndex", () => {
  it("cycles through the palette", () => {
    expect(colorForIndex(0)).toBe(OVERLAY_PALETTE[0]);
    expect(colorForIndex(OVERLAY_PALETTE.length)).toBe(OVERLAY_PALETTE[0]);
    expect(colorForIndex(1)).toBe(OVERLAY_PALETTE[1]);
  });
});

describe("mapAnswersToSeries — LINE", () => {
  it("produces sorted numeric points", () => {
    const series = mapAnswersToSeries(questionOverlay("LINE"), [
      { date: "2026-01-02", value: 5 },
      { date: "2026-01-01", value: "3" },
    ]);
    expect(series.render).toBe("LINE");
    expect(series.markersByCategory).toEqual([]);
    expect(series.points.map((p) => p.y)).toEqual([3, 5]);
    expect(series.points[0].x).toBe("2026-01-01");
  });
});

describe("mapAnswersToSeries — MARKERS", () => {
  it("maps distinct values to colored categories on their own bands", () => {
    const series = mapAnswersToSeries(questionOverlay("MARKERS"), [
      { date: "2026-01-01", value: "yes" },
      { date: "2026-01-02", value: "no" },
      { date: "2026-01-03", value: "maybe" },
      { date: "2026-01-04", value: "maybe" },
    ]);
    expect(series.points).toEqual([]);
    expect(series.markersByCategory).toHaveLength(3);

    const labels = series.markersByCategory.map((c) => c.label);
    expect(labels).toEqual(["yes", "no", "maybe"]);

    const maybe = series.markersByCategory[2];
    expect(maybe.color).toBe(colorForIndex(2));
    expect(maybe.points).toHaveLength(2);
    expect(maybe.points.every((p) => p.y === 3)).toBe(true);
    expect(maybe.points[0].x).toBe("2026-01-03");
  });

  it("skips null and empty values", () => {
    const series = mapAnswersToSeries(questionOverlay("MARKERS"), [
      { date: "2026-01-01", value: null },
      { date: "2026-01-02", value: "  " },
      { date: "2026-01-03", value: ["a", "b"] },
    ]);
    expect(series.markersByCategory).toHaveLength(1);
    expect(series.markersByCategory[0].label).toBe("a, b");
  });
});

describe("mapEventsToMarkers", () => {
  it("builds one category at a single band, sorted by date", () => {
    const series = mapEventsToMarkers(moduleOverlay(), [
      { date: "2026-01-03" },
      { date: "2026-01-01" },
    ]);
    expect(series.markersByCategory).toHaveLength(1);
    const category = series.markersByCategory[0];
    expect(category.label).toBe("Aspirin");
    expect(category.color).toBe("#123456");
    expect(category.points.map((p) => p.x)).toEqual([
      "2026-01-01",
      "2026-01-03",
    ]);
    expect(category.points.every((p) => p.y === 1)).toBe(true);
  });

  it("returns no categories for an empty event list", () => {
    const series = mapEventsToMarkers(moduleOverlay(), []);
    expect(series.markersByCategory).toEqual([]);
  });
});

describe("buildOverlayChartModel", () => {
  it("merges primary, line and marker series into sorted rows", () => {
    const line = mapAnswersToSeries(questionOverlay("LINE"), [
      { date: "2026-01-02", value: 7 },
    ]);
    const markers = mapEventsToMarkers(moduleOverlay(), [
      { date: "2026-01-03" },
    ]);

    const model = buildOverlayChartModel(
      [
        { x: "2026-01-01", y: 1, yLabel: "1" },
        { x: "2026-01-02", y: 2, yLabel: "2" },
      ],
      [line, markers],
    );

    expect(model.rows.map((r) => r.x)).toEqual([
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
    ]);
    expect(model.lines).toHaveLength(1);
    expect(model.markers).toHaveLength(1);
    expect(model.maxBand).toBe(1);

    const lineKey = model.lines[0].key;
    expect(model.rows[1][lineKey]).toBe(7);
    expect(model.rows[0][lineKey]).toBeUndefined();

    const markerKey = model.markers[0].key;
    expect(model.rows[2][markerKey]).toBe(1);
  });
});
