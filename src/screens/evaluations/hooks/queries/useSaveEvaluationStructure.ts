import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { saveEvaluationStructure } from "@/api/evaluationApi";
import type { BackendStructurePayload } from "../../lib/transformStructure";

export function useSaveEvaluationStructure() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      evaluationId,
      payload,
    }: {
      evaluationId: string;
      payload: BackendStructurePayload;
    }) => saveEvaluationStructure(clinicId!, evaluationId, payload),
    onSuccess: (_data, { evaluationId }) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({
        queryKey: ["evaluation-structure", evaluationId],
      });
    },
  });

  return { saveStructure: mutateAsync, isSaving: isPending };
}
