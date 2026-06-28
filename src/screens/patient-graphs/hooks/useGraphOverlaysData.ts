import { useQuery } from "@tanstack/react-query";
import type { IOverlaySeries } from "@/common/types/graph";
import { getPatientEvaluationSubmissions } from "@/api/patientEvaluationApi";
import { fetchPatientMedicationLogs } from "@/api/medicationService";
import { getPatientActivityLogs } from "@/api/activitiesApi";
import { mapAnswersToSeries, mapEventsToMarkers } from "@/lib/overlaySeries";
import { useGraphStructureQuery } from "@/screens/graphs/hooks/queries/useGraphStructureQuery";

function matchesDate(timestamp: string, date?: string): boolean {
  if (!date) return true;
  return timestamp.slice(0, 10) === date;
}

/**
 * Builds the renderable overlay series for a graph: reads the overlay config
 * from the graph structure, then fetches and maps data from the relevant
 * per-patient endpoints (evaluation submissions, medication / activity logs).
 */
export function useGraphOverlaysData(
  graphId: string,
  patientId: string | undefined,
  clinicId: string | null,
  date?: string,
) {
  const { data: structure } = useGraphStructureQuery(graphId);
  const overlays = structure?.overlays ?? [];

  const hasQuestion = overlays.some((o) => o.type === "QUESTION");
  const hasMedication = overlays.some((o) => o.type === "MEDICATION");
  const hasActivity = overlays.some((o) => o.type === "ACTIVITY");
  const ready = !!clinicId && !!patientId;

  const submissions = useQuery({
    queryKey: ["graph-overlay-submissions", clinicId, patientId],
    queryFn: () => getPatientEvaluationSubmissions(clinicId!, patientId!),
    enabled: ready && hasQuestion,
  });

  const medLogs = useQuery({
    queryKey: ["graph-overlay-med-logs", clinicId, patientId],
    queryFn: () => fetchPatientMedicationLogs(clinicId!, patientId!),
    enabled: ready && hasMedication,
  });

  const activityLogs = useQuery({
    queryKey: ["graph-overlay-activity-logs", clinicId, patientId],
    queryFn: () => getPatientActivityLogs(clinicId!, patientId!),
    enabled: ready && hasActivity,
  });

  const overlaySeries: IOverlaySeries[] = overlays.map((overlay) => {
    if (overlay.type === "QUESTION") {
      const answers = (submissions.data ?? [])
        .filter((s) => !overlay.evaluationId || s.evaluationId === overlay.evaluationId)
        .filter((s) => matchesDate(s.submissionDate, date))
        .flatMap((s) =>
          s.answers
            .filter((a) => a.element === overlay.elementId)
            .map((a) => ({ date: s.submissionDate, value: a.value })),
        );
      return mapAnswersToSeries(overlay, answers);
    }

    if (overlay.type === "MEDICATION") {
      const events = (medLogs.data ?? [])
        .filter((l) => l.status === "TAKEN")
        .filter((l) => !overlay.sourceName || l.med_name === overlay.sourceName)
        .filter((l) => matchesDate(l.taken_at, date))
        .map((l) => ({ date: l.taken_at }));
      return mapEventsToMarkers(overlay, events);
    }

    const events = (activityLogs.data ?? [])
      .filter((l) => !overlay.sourceName || l.activity_name === overlay.sourceName)
      .filter((l) => matchesDate(l.time_done, date))
      .map((l) => ({ date: l.time_done }));
    return mapEventsToMarkers(overlay, events);
  });

  const isLoading =
    (hasQuestion && submissions.isLoading) ||
    (hasMedication && medLogs.isLoading) ||
    (hasActivity && activityLogs.isLoading);

  return { overlaySeries, isLoading };
}
