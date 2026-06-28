import { z } from "zod";

const axisSchema = z
  .object({
    source: z.enum(["SUBMISSION_DATE", "SUBMISSION_SCORE", "ELEMENT_ANSWER"]),
    elementId: z.string().optional(),
    label: z.string().optional(),
  })
  .refine((axis) => axis.source !== "ELEMENT_ANSWER" || !!axis.elementId, {
    message: "graphs.errElement",
    path: ["elementId"],
  });

const overlaySchema = z
  .object({
    id: z.string(),
    type: z.enum(["QUESTION", "MEDICATION", "ACTIVITY"]),
    render: z.enum(["LINE", "MARKERS"]),
    label: z.string().optional(),
    color: z.string().optional(),
    evaluationId: z.string().optional(),
    elementId: z.string().optional(),
    sourceName: z.string().optional(),
  })
  .refine(
    (overlay) =>
      overlay.type !== "QUESTION" ||
      (!!overlay.evaluationId && !!overlay.elementId),
    { message: "graphs.errOverlayQuestion", path: ["elementId"] },
  );

export const graphConfigSchema = z.object({
  name: z.string().min(2, "graphs.errName"),
  description: z.string().optional(),
  evaluationId: z.string().min(1, "graphs.errEvaluation"),
  xAxis: axisSchema,
  yAxis: axisSchema,
  overlays: z.array(overlaySchema).default([]),
});

export type GraphConfigFormData = z.infer<typeof graphConfigSchema>;
