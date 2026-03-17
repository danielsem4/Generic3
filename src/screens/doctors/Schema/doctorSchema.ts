import * as z from "zod";

export const doctorSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address (must include @ and .)"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;
