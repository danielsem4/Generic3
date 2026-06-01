import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createEvaluation,
  type ICreateEvaluationPayload,
} from "@/api/evaluationApi";
import type { CreateEvaluationFormData } from "../../schema/evaluationSchema";

export function useCreateEvaluation() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ICreateEvaluationPayload) =>
      createEvaluation(clinicId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });

  async function create(formData: CreateEvaluationFormData) {
    const payload: ICreateEvaluationPayload = {
      evaluation_name: formData.name,
      type: formData.type,
      is_public: formData.isPublic ?? false,
    };
    return mutateAsync(payload);
  }

  return { createEvaluation: create, isSubmitting: isPending };
}
