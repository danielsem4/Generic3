export type TParkinsonSensorEventType =
  | "tremor"
  | "fall"
  | "near_fall"
  | "on_off";

export interface IParkinsonSensorEventRaw {
  id: string;
  event_type: string;
  detected_at?: string;
  created_at?: string;
  sensors?: string | string[];
  details?: string;
  confidence?: number | null;
}

export interface IParkinsonSensorEvent {
  id: string;
  eventType: TParkinsonSensorEventType;
  detectedAt: string;
  sensors: string;
  details: string;
  confidence?: number;
}
