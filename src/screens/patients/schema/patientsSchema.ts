import * as z from "zod";

export type PatientType = "patient" | "research";

export const patientBaseSchema = z.object({
  firstName: z.string().min(2, "patients.errFirstName"),
  lastName: z.string().min(2, "patients.errLastName"),
  email: z.string().email("patients.errEmail"),
  phoneNumber: z.string().regex(/^\d{10}$/, "patients.errPhone"),
});

export const researchPatientSchema = patientBaseSchema.extend({
  password: z.string()
    .min(6, "patients.errPassMin")
    .regex(/[A-Z]/, "patients.errPassUpper")
    .regex(/[0-9]/, "patients.errPassNumber")
    .regex(/[^A-Za-z0-9]/, "patients.errPassSpecial"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "patients.errPassMatch",
  path: ["confirmPassword"],
});

export type PatientFormValues = z.infer<typeof patientBaseSchema>;
export type ResearchPatientFormValues = z.infer<typeof researchPatientSchema>;

// Legacy alias kept for backwards compatibility
export const patientsSchema = researchPatientSchema;
export type PatientsFormValues = ResearchPatientFormValues;
