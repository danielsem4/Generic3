import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUsers, createPatient } from "./usersApi";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import api from "@/lib/axios";

const mockUser = {
  id: 1,
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
  phone_number: "1234567890",
  role: "Patient",
  patient_modules: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUsers", () => {
  it("returns array when response is an array", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [mockUser] });
    const result = await getUsers(1, 2);
    expect(result).toEqual([mockUser]);
    expect(api.get).toHaveBeenCalledWith("/api/v1/users/1/user/2/");
  });

  it("wraps single user in array", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });
    const result = await getUsers(1, 2);
    expect(result).toEqual([mockUser]);
  });
});

describe("createPatient", () => {
  it("posts to correct endpoint and returns the created user", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockUser });
    const payload = {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone_number: "1234567890",
      password: "Secret1!",
      role: "Patient",
      clinic_id: 1,
    };
    const result = await createPatient(payload);
    expect(result).toEqual(mockUser);
    expect(api.post).toHaveBeenCalledWith("/api/v1/users/1/user/", payload);
  });
});
