import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

import { mapSubmissionRaw } from "./patientMeasurementsApi";
import type { IMeasurementSubmissionRaw } from "@/common/types/patientMeasurementSubmission";

describe("mapSubmissionRaw", () => {
  const baseRaw: IMeasurementSubmissionRaw = {
    id: "sub-1",
    measurement: "meas-1",
    measurement_name: "Blood Pressure",
    submitted_at: "2026-01-15T10:00:00Z",
    created_at: "2026-01-14T09:00:00Z",
    status: "COMPLETED",
    score: 85,
    max_score: 100,
    frequency: "DAILY",
    answers: [],
  };

  it("maps all fields correctly", () => {
    const result = mapSubmissionRaw(baseRaw);
    expect(result.id).toBe("sub-1");
    expect(result.measurementId).toBe("meas-1");
    expect(result.measurementName).toBe("Blood Pressure");
    expect(result.submissionDate).toBe("2026-01-15T10:00:00Z");
    expect(result.grade).toBe("85");
    expect(result.maxScore).toBe("100");
  });

  it("preserves raw frequency enum value", () => {
    expect(mapSubmissionRaw({ ...baseRaw, frequency: "ONCE" }).frequency).toBe("ONCE");
    expect(mapSubmissionRaw({ ...baseRaw, frequency: "DAILY" }).frequency).toBe("DAILY");
    expect(mapSubmissionRaw({ ...baseRaw, frequency: "WEEKLY" }).frequency).toBe("WEEKLY");
    expect(mapSubmissionRaw({ ...baseRaw, frequency: "MONTHLY" }).frequency).toBe("MONTHLY");
  });

  it("falls back to created_at when submitted_at is missing", () => {
    const raw = { ...baseRaw, submitted_at: undefined };
    expect(mapSubmissionRaw(raw).submissionDate).toBe("2026-01-14T09:00:00Z");
  });

  it('returns "-" when both dates are missing', () => {
    const raw = { ...baseRaw, submitted_at: undefined, created_at: undefined };
    expect(mapSubmissionRaw(raw).submissionDate).toBe("-");
  });

  it('returns "-" for null/undefined score', () => {
    expect(mapSubmissionRaw({ ...baseRaw, score: null }).grade).toBe("-");
    expect(mapSubmissionRaw({ ...baseRaw, score: undefined }).grade).toBe("-");
  });

  it('returns "-" for null/undefined max_score', () => {
    expect(mapSubmissionRaw({ ...baseRaw, max_score: null }).maxScore).toBe("-");
    expect(mapSubmissionRaw({ ...baseRaw, max_score: undefined }).maxScore).toBe("-");
  });

  it("handles zero score correctly", () => {
    expect(mapSubmissionRaw({ ...baseRaw, score: 0 }).grade).toBe("0");
  });

  it("defaults answers to empty array", () => {
    const raw = { ...baseRaw, answers: undefined };
    expect(mapSubmissionRaw(raw).answers).toEqual([]);
  });

  it("defaults measurement_name to empty string", () => {
    const raw = { ...baseRaw, measurement_name: undefined };
    expect(mapSubmissionRaw(raw).measurementName).toBe("");
  });

  it("returns raw value for unknown frequency", () => {
    const raw = { ...baseRaw, frequency: "CUSTOM" };
    expect(mapSubmissionRaw(raw).frequency).toBe("CUSTOM");
  });

  it('returns "-" for undefined frequency', () => {
    const raw = { ...baseRaw, frequency: undefined };
    expect(mapSubmissionRaw(raw).frequency).toBe("-");
  });
});
