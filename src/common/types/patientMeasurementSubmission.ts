export interface IMeasurementSubmissionRaw {
  id: string;
  measurement: string;
  measurement_name?: string;
  measurement_type?: string;
  submission_date?: string;
  submitted_at?: string;
  frequency?: string;
  grade?: number | string | null;
  max_grade?: number | string | null;
  is_active?: boolean;
  is_public?: boolean;
}

export interface IPatientMeasurementSubmission {
  id: string;
  measurementId: string;
  measurementName: string;
  measurementType: string;
  submissionDate: string;
  frequency: string;
  grade: string;
}