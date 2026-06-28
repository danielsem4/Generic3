import { useParams, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useGraphsQuery } from "@/screens/graphs/hooks/queries/useGraphsQuery";

export function usePatientGraphs() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const clinicId = useAuthStore((s) => s.clinicId);
  const { data: graphs = [], isLoading } = useGraphsQuery(clinicId);

  // The graph to show comes from the ?graph=<id> link used by the patient
  // card; fall back to the first graph when it's missing or no longer present.
  const graphParam = searchParams.get("graph");
  const selectedGraph =
    graphs.find((g) => g.id === graphParam) ?? graphs[0];

  return {
    graphs,
    selectedGraph,
    userId,
    clinicId,
    isLoading,
  };
}
