import * as z from "zod";

export const activitySchema = z.object({
  activity_name: z.string().min(1, "activities.errActivityName"),
  activity_description: z.string().min(1, "activities.errActivityDescription"),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;
