import { describe, it, expect, vi, beforeEach } from "vitest";
import { getModules } from "./modulesApi";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

import api from "@/lib/axios";

const mockModules = [
  { id: 1, name: "Exams", description: "Exam module", active: true },
  { id: 2, name: "Medications", description: "Medications module", active: false },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getModules", () => {
  it("fetches and returns modules array", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockModules });
    const result = await getModules();
    expect(result).toEqual(mockModules);
    expect(api.get).toHaveBeenCalledWith("/api/v1/modules");
  });

  it("returns empty array when server returns empty array", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    const result = await getModules();
    expect(result).toEqual([]);
  });
});
