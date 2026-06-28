import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchEvaluationStructure } from "@/api/evaluationApi";

export interface IGraphElement {
  id: string;
  label: string;
}

/**
 * Fetches the linked questionnaire's structure and returns its answerable
 * input elements ({id, label}) for use as axis sources.
 */
export function useGraphElements(evaluationId: string | undefined) {
  const clinicId = useAuthStore((s) => s.clinicId);

  const { data } = useQuery({
    queryKey: ["graph-elements", clinicId, evaluationId],
    queryFn: () => fetchEvaluationStructure(clinicId!, evaluationId!),
    enabled: !!clinicId && !!evaluationId,
  });

  const elements: IGraphElement[] = (data?.screens ?? [])
    .flatMap((screen) => screen.rows)
    .flatMap((row) => row.elements)
    .filter((el) => el.element_type.startsWith("INPUT_"))
    .map((el) => ({ id: el.id, label: el.label }));

  return { elements };
}
