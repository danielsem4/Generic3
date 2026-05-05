import * as z from "zod";

export const clinicSchema = z
  .object({
    clinicName: z.string().min(2, "clinicManagers.errClinicName"),
    clinicUrl: z.string().url("clinicManagers.errClinicUrl"),
    clinicType: z.enum(["STANDARD", "RESEARCH"]),
    clinicImageUrl: z.string().optional(),
    availableModules: z.array(z.string()),
    managerMode: z.enum(["create", "existing"]),
    managerFirstName: z.string(),
    managerLastName: z.string(),
    managerEmail: z.string(),
    managerPhone: z.string(),
    managerPassword: z.string(),
    selectedManagerId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.clinicImageUrl && !z.string().url().safeParse(data.clinicImageUrl).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errImageUrl", path: ["clinicImageUrl"] });
    }
    if (data.managerMode === "create") {
      if (data.managerFirstName.length < 2)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errFirstName", path: ["managerFirstName"] });
      if (data.managerLastName.length < 2)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errLastName", path: ["managerLastName"] });
      if (!z.string().email().safeParse(data.managerEmail).success)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errEmail", path: ["managerEmail"] });
      if (!/^\+?\d{7,15}$/.test(data.managerPhone))
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errPhone", path: ["managerPhone"] });
      if (data.managerPassword.length < 8)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errPassword", path: ["managerPassword"] });
    } else {
      if (!data.selectedManagerId)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errSelectManager", path: ["selectedManagerId"] });
    }
  });

export type ClinicFormValues = z.infer<typeof clinicSchema>;

export const STEP1_FIELDS = ["clinicName", "clinicUrl", "clinicType"] as const;
export const STEP3_CREATE_FIELDS = ["managerFirstName", "managerLastName", "managerEmail", "managerPhone", "managerPassword"] as const;
export const STEP3_EXISTING_FIELDS = ["selectedManagerId"] as const;
