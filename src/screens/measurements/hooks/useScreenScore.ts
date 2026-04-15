import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";
import type { IQComponent } from "@/common/types/measurement";

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
  const components = useMeasurementBuilderStore(selectActiveScreenComponents);
  return sumGrades(components);
}
