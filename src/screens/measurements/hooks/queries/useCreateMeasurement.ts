import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createMeasurement,
  type ICreateMeasurementPayload,
} from "@/api/measurementsApi";
import type { CreateMeasurementFormData } from "../../schema/measurementSchema";

export function useCreateMeasurement() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ICreateMeasurementPayload) =>
      createMeasurement(clinicId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
    },
  });

  async function create(formData: CreateMeasurementFormData) {
    const payload: ICreateMeasurementPayload = {
      measurement_name: formData.name,
      type: formData.type,
      is_public: formData.isPublic ?? false,
    };
    return mutateAsync(payload);
  }

  return { createMeasurement: create, isSubmitting: isPending };
}
