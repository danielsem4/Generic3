import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { updateGraph, type IGraphMetaPayload } from "@/api/graphApi";

export function useUpdateGraph() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      graphId,
      data,
    }: {
      graphId: string;
      data: IGraphMetaPayload;
    }) => updateGraph(clinicId!, graphId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphs"] });
    },
  });

  return { updateGraph: mutateAsync, isUpdating: isPending };
}
