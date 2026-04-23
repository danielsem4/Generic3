import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { saveMeasurementStructure } from "@/api/measurementsApi";
import type { BackendStructurePayload } from "../lib/transformStructure";

export function useSaveMeasurementStructure() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      measurementId,
      payload,
    }: {
      measurementId: string;
      payload: BackendStructurePayload;
    }) => saveMeasurementStructure(clinicId!, measurementId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
    },
  });

  return { saveStructure: mutateAsync, isSaving: isPending };
}
