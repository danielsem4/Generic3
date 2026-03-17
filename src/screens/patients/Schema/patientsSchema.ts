import * as z from "zod";

export type PatientType = "patient" | "research";

export const patientBaseSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address (must include @ and .)"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export const researchPatientSchema = patientBaseSchema.extend({
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character (!@#$%^&*)"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type PatientFormValues = z.infer<typeof patientBaseSchema>;
export type ResearchPatientFormValues = z.infer<typeof researchPatientSchema>;

// Legacy alias kept for backwards compatibility
export const patientsSchema = researchPatientSchema;
export type PatientsFormValues = ResearchPatientFormValues;
