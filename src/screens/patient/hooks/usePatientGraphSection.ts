import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useGraphsQuery } from "@/screens/graphs/hooks/queries/useGraphsQuery";
import type { ISectionItem, ISectionRouteMapper } from "@/common/types/section";

// Builds the patient card's "Graphs" section: one row per active clinic graph,
// each navigating to the patient graphs screen with that graph pre-selected.
export function usePatientGraphSection() {
  const navigate = useNavigate();
  const clinicId = useAuthStore((s) => s.clinicId);
  const { data: graphs = [] } = useGraphsQuery(clinicId);

  const activeGraphs = graphs.filter((graph) => graph.isActive);

  const graphItems: ISectionItem[] = activeGraphs.map((graph) => ({
    id: graph.id,
    label: graph.name,
  }));

  // SectionsGrid resolves handlers via routeMapper[item.label], so the mapper
  // is keyed by graph name. Two graphs sharing a name would collide on the same
  // handler — an acceptable edge case matching the existing label-based pattern.
  const graphActions: ISectionRouteMapper = Object.fromEntries(
    activeGraphs.map((graph) => [
      graph.name,
      () => navigate(`graphs?graph=${graph.id}`),
    ]),
  );

  return { graphItems, graphActions };
}
