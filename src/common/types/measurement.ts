export interface IMeasurementAnswer {
  id: string;
  label: string;
  value: string | number | boolean;
  is_correct: boolean | null;
  points_earned: number | null;
  element_type: string;
}

export interface IMeasurementSubmission {
  id: string;
  measurement_name: string;
  status: string;
  submitted_at: string;
  score: number;
  answers: IMeasurementAnswer[];
}

export type FrequencyType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
export type MeasurementType = 'form' | 'score' | 'calculation' | string;

export interface IAssignMeasurementPayload {
  measurement_id: string;
  doctor_user_id: string;
  start_date: string; // ISO format (YYYY-MM-DD)
  end_date: string;
  frequency: FrequencyType;
  frequency_data: {
    date: string;
    time_slots: string[];
  };
}