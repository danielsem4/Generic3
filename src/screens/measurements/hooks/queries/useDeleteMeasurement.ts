import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { deleteMeasurement } from "@/api/measurementsApi";

export function useDeleteMeasurement() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (measurementId: string) =>
      deleteMeasurement(clinicId!, measurementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
    },
  });

  return { deleteMeasurement: mutateAsync, isDeleting: isPending };
}
