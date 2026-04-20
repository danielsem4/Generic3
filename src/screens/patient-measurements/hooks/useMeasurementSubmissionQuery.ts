import { useQuery } from "@tanstack/react-query";
import { fetchMeasurementSubmission } from "@/api/measurementsApi";

export function useMeasurementSubmissionQuery(
  clinicId: string | null,
  patientId: string,
  submissionId: string,
) {
  return useQuery({
    queryKey: ["measurement-submission", clinicId, patientId, submissionId],
    queryFn: () => fetchMeasurementSubmission(clinicId!, patientId, submissionId),
    enabled: !!clinicId && !!patientId && !!submissionId,
  });
}
