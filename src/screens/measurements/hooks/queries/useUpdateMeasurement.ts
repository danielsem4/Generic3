import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  updateMeasurement,
  type IUpdateMeasurementPayload,
} from "@/api/measurementsApi";

interface UpdateMeasurementVars {
  measurementId: string;
  data: IUpdateMeasurementPayload;
}

export function useUpdateMeasurement() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ measurementId, data }: UpdateMeasurementVars) =>
      updateMeasurement(clinicId!, measurementId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
    },
  });

  return { updateMeasurement: mutateAsync, isUpdating: isPending };
}
