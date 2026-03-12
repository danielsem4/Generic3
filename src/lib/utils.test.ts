import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const inactive = false;
    const active = true;
    expect(cn("foo", inactive && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", active && "bar", "baz")).toBe("foo bar baz");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("handles array inputs", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});
