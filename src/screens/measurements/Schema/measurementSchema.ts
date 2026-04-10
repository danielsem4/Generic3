import { z } from "zod";

export const createMeasurementSchema = z.object({
  name: z.string().min(2, "measurements.errName"),
  description: z.string().optional(),
});

export type CreateMeasurementFormData = z.infer<
  typeof createMeasurementSchema
>;
