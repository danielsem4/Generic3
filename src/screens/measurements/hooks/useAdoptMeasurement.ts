import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { adoptMeasurement } from "@/api/measurementsApi";

interface AdoptParams {
  measurementId: string;
}

export function useAdoptMeasurement() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ measurementId }: AdoptParams) =>
      adoptMeasurement(clinicId!, measurementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      queryClient.invalidateQueries({ queryKey: ["publicMeasurements"] });
    },
  });

  return { adoptMeasurement: mutateAsync, isAdopting: isPending };
}
