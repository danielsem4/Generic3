import type { IEvaluationSubmissionRaw, IPatientEvaluationSubmission } from "@/common/types/patientEvaluationSubmission";
import api from "@/lib/axios";

function normalizeFrequency(value?: string): string {
  switch (value) {
    case "ONCE":
    case "DAILY":
    case "WEEKLY":
    case "MONTHLY":
      return value;
    default:
      return value || "-";
  }
}


export function mapSubmissionRaw(
  raw: IEvaluationSubmissionRaw,
): IPatientEvaluationSubmission {
  return {
    id: raw.id,
    evaluationId: raw.evaluation,
    evaluationName: raw.evaluation_name || "",
    submissionDate: raw.submitted_at || raw.created_at || "-",
    frequency: normalizeFrequency(raw.frequency),
    grade:
      raw.score !== null && raw.score !== undefined
        ? String(raw.score)
        : "-",
    maxScore:
      raw.max_score !== null && raw.max_score !== undefined
        ? String(raw.max_score)
        : "-",
    answers: raw.answers ?? [],
  };
}

export async function getPatientEvaluationSubmissions(
  clinicId: string,
  userId: string,
): Promise<IPatientEvaluationSubmission[]> {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/patients/${userId}/evaluation-submissions/`,
  );

  const submissions = Array.isArray(data) ? data : data.results ?? [];
  return submissions.map(mapSubmissionRaw);
}

export async function getSingleSubmission(
  clinicId: string,
  userId: string,
  submissionId: string,
): Promise<IPatientEvaluationSubmission> {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/patients/${userId}/evaluation-submissions/${submissionId}/`,
  );

  return mapSubmissionRaw(data);
}

export type TEvaluationFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface IAssignPatientEvaluationPayload {
  evaluation_id: string;
  doctor_user_id: string;
  start_date: string;
  end_date?: string;
  frequency: TEvaluationFrequency;
  frequency_data: {
    date?: string;
    time_slots?: string[];
    days_of_week?: string[];
    day_of_month?: number;
    time?: string;
    times_per_day?: number;
  };
}

export async function assignPatientEvaluation(
  clinicId: string,
  userId: string,
  payload: IAssignPatientEvaluationPayload,
) {
  const { data } = await api.post(
    `/api/v1/clinics/${clinicId}/patients/${userId}/evaluations/`,
    payload,
  );

  return data;
}

export async function deletePatientEvaluationSubmission(
  clinicId: string,
  userId: string,
  submissionId: string,
) {
  return api.delete(
    `/api/v1/clinics/${clinicId}/patients/${userId}/evaluation-submissions/${submissionId}/`
  );
}

export async function deleteEvaluationAnswer(
  clinicId: string,
  userId: string,
  submissionId: string,
  Id: string,
) {
  return api.delete(
    `/api/v1/clinics/${clinicId}/patients/${userId}/evaluation-submissions/${submissionId}/answers/${Id}/`
  );
}

export async function updateEvaluationAnswerScore(
  clinicId: string,
  userId: string,
  submissionId: string,
  answerId: string,
  score: number,
) {
  return api.patch(
    `/api/v1/clinics/${clinicId}/patients/${userId}/evaluation-submissions/${submissionId}/answers/${answerId}/`,
    { points_earned: score },
  );
}
