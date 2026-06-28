import { describe, it, expect } from "vitest";
import { formatDateTime } from "./formatDate";

describe("formatDateTime", () => {
  it("formats a full datetime as DD/MM/YYYY HH:MM (24-hour)", () => {
    expect(formatDateTime("2026-06-23T14:05:00")).toBe("23/06/2026 14:05");
  });

  it("renders midnight as 00:00", () => {
    expect(formatDateTime("2026-06-23T00:00:00")).toBe("23/06/2026 00:00");
  });

  it("zero-pads single-digit day, month, hour, and minute", () => {
    expect(formatDateTime("2026-01-05T09:07:00")).toBe("05/01/2026 09:07");
  });

  it("returns the input unchanged when it is not a valid date", () => {
    expect(formatDateTime("not-a-date")).toBe("not-a-date");
  });

  it("returns '-' for empty or dash input", () => {
    expect(formatDateTime("")).toBe("-");
    expect(formatDateTime("-")).toBe("-");
  });
});
