import * as z from "zod";

export const doctorSchema = z.object({
  firstName: z.string().min(2, "doctors.errFirstName"),
  lastName: z.string().min(2, "doctors.errLastName"),
  email: z.string().email("doctors.errEmail"),
  phoneNumber: z.string().regex(/^\d{10}$/, "doctors.errPhone"),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;
