import { describe, it, expect } from "vitest";
import { coerceY, transformGraphData } from "./transformGraphData";
import type { IRawDataPoint } from "@/common/types/graph";

describe("coerceY", () => {
  it("passes numbers through", () => {
    expect(coerceY(3)).toEqual({ y: 3, yLabel: "3" });
    expect(coerceY(0)).toEqual({ y: 0, yLabel: "0" });
  });

  it("maps booleans to 1/0", () => {
    expect(coerceY(true)).toEqual({ y: 1, yLabel: "true" });
    expect(coerceY(false)).toEqual({ y: 0, yLabel: "false" });
  });

  it("parses numeric strings", () => {
    expect(coerceY("3.5")).toEqual({ y: 3.5, yLabel: "3.5" });
  });

  it("maps categorical strings via labelMap", () => {
    expect(coerceY("Mild", { Mild: 1, Severe: 3 })).toEqual({
      y: 1,
      yLabel: "Mild",
    });
  });

  it("returns null for null, empty, non-finite, and unmapped categorical", () => {
    expect(coerceY(null)).toBeNull();
    expect(coerceY("")).toBeNull();
    expect(coerceY(Number.NaN)).toBeNull();
    expect(coerceY("Mild")).toBeNull();
  });
});

describe("transformGraphData", () => {
  it("coerces mixed numeric/boolean/string values", () => {
    const raw: IRawDataPoint[] = [
      { x: 1, y: 5 },
      { x: 2, y: true },
      { x: 3, y: "4" },
    ];
    expect(transformGraphData(raw)).toEqual([
      { x: 1, y: 5, yLabel: "5" },
      { x: 2, y: 1, yLabel: "true" },
      { x: 3, y: 4, yLabel: "4" },
    ]);
  });

  it("assigns stable ordinals to categorical labels by first appearance", () => {
    const raw: IRawDataPoint[] = [
      { x: 1, y: "Mild" },
      { x: 2, y: "Severe" },
      { x: 3, y: "Mild" },
    ];
    expect(transformGraphData(raw)).toEqual([
      { x: 1, y: 1, yLabel: "Mild" },
      { x: 2, y: 2, yLabel: "Severe" },
      { x: 3, y: 1, yLabel: "Mild" },
    ]);
  });

  it("honors a provided labelMap and continues fallback ordinals after it", () => {
    const raw: IRawDataPoint[] = [
      { x: 1, y: "Mild" },
      { x: 2, y: "Unknown" },
    ];
    expect(transformGraphData(raw, { labelMap: { Mild: 1, Severe: 3 } })).toEqual([
      { x: 1, y: 1, yLabel: "Mild" },
      { x: 2, y: 4, yLabel: "Unknown" },
    ]);
  });

  it("drops null/empty points", () => {
    const raw: IRawDataPoint[] = [
      { x: 1, y: null },
      { x: 2, y: "" },
      { x: 3, y: 2 },
    ];
    expect(transformGraphData(raw)).toEqual([{ x: 3, y: 2, yLabel: "2" }]);
  });

  it("sorts points by x (dates and numbers)", () => {
    const dates: IRawDataPoint[] = [
      { x: "2026-03-02", y: 2 },
      { x: "2026-01-01", y: 1 },
    ];
    expect(transformGraphData(dates).map((p) => p.x)).toEqual([
      "2026-01-01",
      "2026-03-02",
    ]);

    const nums: IRawDataPoint[] = [
      { x: 10, y: 1 },
      { x: 2, y: 2 },
    ];
    expect(transformGraphData(nums).map((p) => p.x)).toEqual([2, 10]);
  });
});
