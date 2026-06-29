import * as z from "zod";

// Reuses the same password rules and i18n error keys as the patients schema (DRY).
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "patients.errPassMin")
      .regex(/[A-Z]/, "patients.errPassUpper")
      .regex(/[0-9]/, "patients.errPassNumber")
      .regex(/[^A-Za-z0-9]/, "patients.errPassSpecial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "patients.errPassMatch",
    path: ["confirmPassword"],
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
