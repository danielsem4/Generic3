import { z } from "zod";
import { EvaluationType } from "@/common/types/evaluation";

export const createEvaluationSchema = z.object({
  name: z.string().min(2, "evaluations.errName"),
  type: z.nativeEnum(EvaluationType, { message: "evaluations.errType" }),
  isPublic: z.boolean(),
});

export type CreateEvaluationFormData = z.infer<
  typeof createEvaluationSchema
>;
