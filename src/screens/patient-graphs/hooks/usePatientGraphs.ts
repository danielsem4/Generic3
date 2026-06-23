import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useGraphsQuery } from "@/screens/graphs/hooks/queries/useGraphsQuery";

export function usePatientGraphs() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const clinicId = useAuthStore((s) => s.clinicId);
  const { data: graphs = [], isLoading } = useGraphsQuery(clinicId);

  // Seed the selection from the ?graph=<id> link used by the patient card.
  const [selectedGraphId, setSelectedGraphId] = useState<string | null>(
    () => searchParams.get("graph"),
  );

  const handleSelect = (id: string) => setSelectedGraphId(id);

  // Fall back to the first graph when nothing is selected yet (or the
  // previous selection is no longer present), avoiding a setState effect.
  const selectedGraph =
    graphs.find((g) => g.id === selectedGraphId) ?? graphs[0];

  return {
    graphs,
    selectedGraph,
    selectedGraphId: selectedGraph?.id,
    handleSelect,
    userId,
    clinicId,
    isLoading,
  };
}
