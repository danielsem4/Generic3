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

// An overlay adds extra data on top of the primary series, sharing the X
// (date) axis. QUESTION pulls another question's answers; MEDICATION/ACTIVITY
// pull event logs from those modules.
export type OverlayType = "QUESTION" | "MEDICATION" | "ACTIVITY";

// How an overlay is drawn: as an extra line, or as colored markers/dots
// (one color per distinct value) placed at the time of each event/answer.
export type OverlayRender = "LINE" | "MARKERS";

export interface IGraphOverlay {
  id: string; // client-generated row id; stable key for the builder form
  type: OverlayType;
  render: OverlayRender;
  label?: string;
  color?: string; // base color (MARKERS may derive per-value colors)
  evaluationId?: string; // QUESTION: source questionnaire (may differ from main)
  elementId?: string; // QUESTION: source question
  sourceName?: string; // MEDICATION/ACTIVITY: optional name filter ("" = all)
}

// Graph structure (separate endpoint): linked questionnaire + both axes.
export interface IGraphStructure {
  evaluationId: string;
  evaluationName?: string;
  xAxis: IAxisConfig;
  yAxis: IAxisConfig;
  overlays: IGraphOverlay[];
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

// A group of marker points sharing one color/label (e.g. all "maybe" answers).
export interface IMarkerCategory {
  label: string;
  color: string;
  points: IGraphPoint[];
}

// A transformed overlay ready to render alongside the primary series.
export interface IOverlaySeries {
  id: string;
  render: OverlayRender;
  label: string;
  color: string;
  points: IGraphPoint[]; // populated for LINE render
  markersByCategory: IMarkerCategory[]; // populated for MARKERS render
}
