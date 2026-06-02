import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  updateEvaluation,
  type IUpdateEvaluationPayload,
} from "@/api/evaluationApi";

interface UpdateEvaluationVars {
  evaluationId: string;
  data: IUpdateEvaluationPayload;
}

export function useUpdateEvaluation() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ evaluationId, data }: UpdateEvaluationVars) =>
      updateEvaluation(clinicId!, evaluationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });

  return { updateEvaluation: mutateAsync, isUpdating: isPending };
}
