export interface IMeasurementAnswer {
  id: string;
  label: string;
  value: string | number | boolean | null; 
  is_correct: boolean | null;
  points_earned: number | null;
  element_type: string; 
  screen_number: number;
  config?: unknown;
}

export interface IMeasurementSubmission {
  id: string;
  measurement_name: string;
  status: string;
  submitted_at: string;
  score: number;
  max_score: number;  
  frequency: string; 
  answers: IMeasurementAnswer[];
}