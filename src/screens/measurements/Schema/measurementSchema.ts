import { z } from "zod";
import { MeasurementType } from "@/common/types/measurement";

export const createMeasurementSchema = z.object({
  name: z.string().min(2, "measurements.errName"),
  type: z.nativeEnum(MeasurementType, { message: "measurements.errType" }),
  isPublic: z.boolean(),
});

export type CreateMeasurementFormData = z.infer<
  typeof createMeasurementSchema
>;
