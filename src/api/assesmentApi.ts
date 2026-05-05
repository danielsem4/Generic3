import api from "@/lib/axios";

// --- Types ---
export interface AssessmentAnswer {
  id: string;
  label: string;
  element_type: string;
  value: unknown;
  points_earned: number | null;
  is_correct: boolean | null;
  config: unknown;
  screen_number: number;
}

export interface AssessmentSubmission {
  id: string;
  measurement_name: string;
  status: string;
  submitted_at: string;
  score: number;
  max_score: number;
  frequency: string;
  answers: AssessmentAnswer[];
}

// --- API ---
export async function getSingleSubmission(
  clinicId: string,
  userId: string,
  submissionId: string
) {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/patients/${userId}/measurement-submissions/`
  );

  const submissions = Array.isArray(data) ? data : data.results ?? [];

  const found = submissions.find((s: AssessmentSubmission) => String(s.id) === String(submissionId));
  
  return found;
}