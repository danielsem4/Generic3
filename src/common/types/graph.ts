// What a single axis maps to. ELEMENT_ANSWER = a specific question's answer.
export type AxisSource = "SUBMISSION_DATE" | "SUBMISSION_SCORE" | "ELEMENT_ANSWER";

export interface IAxisConfig {
  source: AxisSource;
  elementId?: string;
  label?: string;
}

// Basic graph record (CRUD endpoint).
export interface IGraph {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  clinicId?: string;
}

// Graph structure (separate endpoint): linked questionnaire + both axes.
export interface IGraphStructure {
  evaluationId: string;
  evaluationName?: string;
  xAxis: IAxisConfig;
  yAxis: IAxisConfig;
}

// Raw coordinate from the data endpoint; y can be a mixed type.
export interface IRawDataPoint {
  x: string | number;
  y: string | number | boolean | null;
  submissionId?: string;
}

// Mapped data response from the data endpoint.
export interface IGraphData {
  points: IRawDataPoint[];
  xLabel?: string;
  yLabel?: string;
  evaluationName?: string;
}

// After transform: numeric y for plotting + original label for display.
export interface IGraphPoint {
  x: string | number;
  y: number;
  yLabel: string;
}
