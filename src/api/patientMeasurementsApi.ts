import type { IMeasurementSubmissionRaw, IPatientMeasurementSubmission } from "@/common/types/patientMeasurementSubmission";
import api from "@/lib/axios";

function formatFrequency(value?: string) {
  switch (value) {
    case "ONCE":
      return "Once";
    case "DAILY":
      return "Daily";
    case "WEEKLY":
      return "Weekly";
    case "MONTHLY":
      return "Monthly";
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
    frequency: formatFrequency(raw.frequency),
    grade:
      raw.score !== null && raw.score !== undefined
        ? String(raw.score)
        : "-",
    maxScore:
      raw.max_score !== null && raw.max_score !== undefined
        ? String(raw.max_score)
        : "-",
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