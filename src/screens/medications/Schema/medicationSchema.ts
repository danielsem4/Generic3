import * as z from "zod";

export const medicationSchema = z.object({
  medName: z.string().min(1, "medications.errMedName"),
  medForm: z.string().min(1),
  medUnit: z.string().min(1),
});

export type MedicationFormValues = z.infer<typeof medicationSchema>;
