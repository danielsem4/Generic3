import * as z from "zod";

export const clinicSchema = z
  .object({
    clinicName: z.string().min(2, "clinicManagers.errClinicName"),
    clinicUrl: z.string().url("clinicManagers.errClinicUrl"),
    clinicType: z.enum(["STANDARD", "RESEARCH"]),
    clinicLogoFile: z.custom<File>().optional(),
    availableModules: z.array(z.string()),
    managerMode: z.enum(["create", "existing"]),
    managerFirstName: z.string(),
    managerLastName: z.string(),
    managerEmail: z.string(),
    managerPhone: z.string(),
    selectedManagerId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.managerMode === "create") {
      if (data.managerFirstName.length < 2)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errFirstName", path: ["managerFirstName"] });
      if (data.managerLastName.length < 2)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errLastName", path: ["managerLastName"] });
      if (!z.string().email().safeParse(data.managerEmail).success)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errEmail", path: ["managerEmail"] });
      if (!/^\d{10}$/.test(data.managerPhone))
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errPhone", path: ["managerPhone"] });
    } else {
      if (!data.selectedManagerId)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "clinicManagers.errSelectManager", path: ["selectedManagerId"] });
    }
  });

export type ClinicFormValues = z.infer<typeof clinicSchema>;

export const STEP1_FIELDS = ["clinicName", "clinicUrl", "clinicType"] as const;
export const STEP3_CREATE_FIELDS = ["managerFirstName", "managerLastName", "managerEmail", "managerPhone"] as const;
export const STEP3_EXISTING_FIELDS = ["selectedManagerId"] as const;
