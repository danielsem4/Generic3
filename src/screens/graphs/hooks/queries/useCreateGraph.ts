import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { createGraph, type IGraphMetaPayload } from "@/api/graphApi";

export function useCreateGraph() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IGraphMetaPayload) => createGraph(clinicId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphs"] });
    },
  });

  return { createGraph: mutateAsync, isSubmitting: isPending };
}
