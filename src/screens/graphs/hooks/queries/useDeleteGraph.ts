import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { deleteGraph } from "@/api/graphApi";

export function useDeleteGraph() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (graphId: string) => deleteGraph(clinicId!, graphId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphs"] });
    },
  });

  return { deleteGraph: mutateAsync, isDeleting: isPending };
}
