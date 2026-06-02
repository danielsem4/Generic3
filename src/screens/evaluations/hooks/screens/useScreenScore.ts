import {
  useEvaluationBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useEvaluationBuilderStore";
import type { IQComponent } from "@/common/types/evaluation";

function sumGrades(components: IQComponent[]): number {
  let total = 0;
  for (const comp of components) {
    if (comp.type === "rowContainer") {
      total += sumGrades(comp.children);
    } else if ("grade" in comp) {
      total += (comp as unknown as Record<string, unknown>).grade as number ?? 0;
    }
  }
  return total;
}

export function useScreenScore(): number {
  const components = useEvaluationBuilderStore(selectActiveScreenComponents);
  return sumGrades(components);
}
