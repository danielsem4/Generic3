import { z } from "zod";

export const createQuestionnaireSchema = z.object({
  name: z.string().min(2, "questionnaires.errName"),
  description: z.string().optional(),
});

export type CreateQuestionnaireFormData = z.infer<
  typeof createQuestionnaireSchema
>;
