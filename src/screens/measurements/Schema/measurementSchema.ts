import { z } from "zod";
import { MeasurementType } from "@/common/types/measurement";

export const createMeasurementSchema = z.object({
  name: z.string().min(2, "measurements.errName"),
  type: z.nativeEnum(MeasurementType, {
    errorMap: () => ({ message: "measurements.errType" }),
  }),
  description: z.string().optional(),
});

export type CreateMeasurementFormData = z.infer<
  typeof createMeasurementSchema
>;
