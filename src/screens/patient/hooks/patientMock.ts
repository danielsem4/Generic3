import type { IPatientDetailsResponse } from "@/common/types/patientDetails";

export const patientDetailsMock: IPatientDetailsResponse = {
  patient_id: "1",
  first_name: "Daniel",
  last_name: "Samargian",
  email: "danieltest@belinson.com",
  phone: "054-224-9277",
  is_research: false,
  clinic_name: "Belinson Clinic",
  active_modules: ["My Medications"],
  active_measurements: ["measure_a", "measure_b"],
  security: {
    is_2fa_enabled: true,
    joined_at: "2026-03-17",
  },
};