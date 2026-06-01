import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { deleteEvaluation } from "@/api/evaluationApi";

export function useDeleteEvaluation() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (evaluationId: string) =>
      deleteEvaluation(clinicId!, evaluationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });

  return { deleteEvaluation: mutateAsync, isDeleting: isPending };
}
