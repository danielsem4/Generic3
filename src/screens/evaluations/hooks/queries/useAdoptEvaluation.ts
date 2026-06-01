import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { adoptEvaluation } from "@/api/evaluationApi";

interface AdoptParams {
  evaluationId: string;
}

export function useAdoptEvaluation() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ evaluationId }: AdoptParams) =>
      adoptEvaluation(clinicId!, evaluationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["publicEvaluations"] });
    },
  });

  return { adoptEvaluation: mutateAsync, isAdopting: isPending };
}
