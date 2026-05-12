import * as z from "zod";

export const medicationSchema = z.object({
  med_name: z.string().min(1, "medications.errMedName"),
  med_form: z.string().min(1, "medications.errMedForm"),
  med_unit: z.string().min(1, "medications.errMedUnit"),
});

export type MedicationFormValues = z.infer<typeof medicationSchema>;
