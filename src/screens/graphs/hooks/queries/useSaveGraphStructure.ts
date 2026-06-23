import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { saveGraphStructure } from "@/api/graphApi";
import type { IGraphStructure } from "@/common/types/graph";

export function useSaveGraphStructure() {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      graphId,
      structure,
    }: {
      graphId: string;
      structure: IGraphStructure;
    }) => saveGraphStructure(clinicId!, graphId, structure),
    onSuccess: (_data, { graphId }) => {
      queryClient.invalidateQueries({ queryKey: ["graph-structure", graphId] });
    },
  });

  return { saveGraphStructure: mutateAsync, isSavingStructure: isPending };
}
