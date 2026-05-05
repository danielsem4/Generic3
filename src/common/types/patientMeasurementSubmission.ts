export interface IMeasurementSubmissionAnswerRaw {
  id: string;
  element: string;
  element_type: string;
  label: string;
  config: Record<string, unknown>;
  screen_number: number;
  row_number: number;
  order_in_row: number;
  value: string | number | boolean | string[] | null;
  is_correct: boolean | null;
  points_earned: number | null;
  answers: IMeasurementSubmissionAnswerRaw[];
}

export interface IMeasurementSubmissionRaw {
  id: string;
  measurement: string;
  measurement_name?: string;
  submitted_at?: string;
  created_at?: string;
  status?: string;
  score?: number | string | null;
  max_score?: number | string | null;
  frequency?: string;
  answers?: IMeasurementSubmissionAnswerRaw[];
}

export interface IPatientMeasurementSubmission {
  id: string;
  measurementId: string;
  measurementName: string;
  submissionDate: string;
  frequency: string;
  grade: string | number;
  maxScore: string | number;
  answers: IMeasurementSubmissionAnswerRaw[];
}