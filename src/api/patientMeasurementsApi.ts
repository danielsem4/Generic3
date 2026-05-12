import type { IMeasurementSubmissionRaw, IPatientMeasurementSubmission } from "@/common/types/patientMeasurementSubmission";
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
  raw: IMeasurementSubmissionRaw,
): IPatientMeasurementSubmission {
  return {
    id: raw.id,
    measurementId: raw.measurement,
    measurementName: raw.measurement_name || "",
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

export async function getPatientMeasurementSubmissions(
  clinicId: string,
  userId: string,
): Promise<IPatientMeasurementSubmission[]> {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/patients/${userId}/measurement-submissions/`,
  );

  const submissions = Array.isArray(data) ? data : data.results ?? [];
  return submissions.map(mapSubmissionRaw);
}

export async function getSingleSubmission(
  clinicId: string,
  userId: string,
  submissionId: string,
): Promise<IPatientMeasurementSubmission> {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/patients/${userId}/measurement-submissions/${submissionId}/`,
  );

  return mapSubmissionRaw(data);
}

export type TMeasurementFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface IAssignPatientMeasurementPayload {
  measurement_id: string;
  doctor_user_id: string;
  start_date: string;
  end_date?: string;
  frequency: TMeasurementFrequency;
  frequency_data: {
    date?: string;
    time_slots?: string[];
    days_of_week?: string[];
    day_of_month?: number;
    time?: string;
    times_per_day?: number;
  };
}

export async function assignPatientMeasurement(
  clinicId: string,
  userId: string,
  payload: IAssignPatientMeasurementPayload,
) {
  const { data } = await api.post(
    `/api/v1/clinics/${clinicId}/patients/${userId}/measurements/`,
    payload,
  );

  return data;
}

export async function deletePatientMeasurementSubmission(
  clinicId: string,
  userId: string,
  submissionId: string,
) {
  return api.delete(
    `/api/v1/clinics/${clinicId}/patients/${userId}/measurement-submissions/${submissionId}/`
  );
}

export async function deleteMeasurementAnswer(
  clinicId: string,
  userId: string,
  submissionId: string,
  Id: string,
) {
  return api.delete(
    `/api/v1/clinics/${clinicId}/patients/${userId}/measurement-submissions/${submissionId}/answers/${Id}/`
  );
}

export async function updateMeasurementAnswerScore(
  clinicId: string,
  userId: string,
  submissionId: string,
  answerId: string,
  score: number,
) {
  return api.patch(
    `/api/v1/clinics/${clinicId}/patients/${userId}/measurement-submissions/${submissionId}/answers/${answerId}/`,
    { points_earned: score },
  );
}