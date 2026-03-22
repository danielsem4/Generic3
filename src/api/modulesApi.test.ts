import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClinicModules } from "./modulesApi";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

import api from "@/lib/axios";

const mockModules = [
  { id: 1, module_name: "Medications" },
  { id: 2, module_name: "Activities" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getClinicModules", () => {
  it("fetches and returns modules array for a clinic", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockModules });
    const result = await getClinicModules("clinic-123");
    expect(result).toEqual(mockModules);
    expect(api.get).toHaveBeenCalledWith("/api/v1/users/clinic-123/modules/");
  });

  it("returns empty array when server returns empty array", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    const result = await getClinicModules("clinic-123");
    expect(result).toEqual([]);
  });
});
