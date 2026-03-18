import * as z from "zod";

export const clinicSchema = z.object({
  clinicName: z.string().min(2, "clinicManagers.errClinicName"),
  clinicUrl: z.string().url("clinicManagers.errClinicUrl"),
  clinicType: z.enum(["STANDARD", "RESEARCH"]),
  clinicLogoFile: z.custom<File>().optional(),
  availableModules: z.array(z.string()),
  managerFirstName: z.string().min(2, "clinicManagers.errFirstName"),
  managerLastName: z.string().min(2, "clinicManagers.errLastName"),
  managerEmail: z.string().email("clinicManagers.errEmail"),
  managerPhone: z.string().regex(/^\d{10}$/, "clinicManagers.errPhone"),
});

export type ClinicFormValues = z.infer<typeof clinicSchema>;

export const STEP1_FIELDS = ["clinicName", "clinicUrl", "clinicType"] as const;
export const STEP3_FIELDS = [
  "managerFirstName",
  "managerLastName",
  "managerEmail",
  "managerPhone",
] as const;
