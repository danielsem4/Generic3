import type {
  IParkinsonSensorEvent,
  IParkinsonSensorEventRaw,
  TParkinsonSensorEventType,
} from "@/common/types/parkinsonSensor";
import api from "@/lib/axios";

function normalizeEventType(value?: string): TParkinsonSensorEventType {
  switch (value) {
    case "tremor":
    case "fall":
    case "near_fall":
    case "on_off":
      return value;
    default:
      return "on_off";
  }
}

export function mapSensorEventRaw(
  raw: IParkinsonSensorEventRaw,
): IParkinsonSensorEvent {
  return {
    id: raw.id,
    eventType: normalizeEventType(raw.event_type),
    detectedAt: raw.detected_at || raw.created_at || "-",
    sensors: Array.isArray(raw.sensors)
      ? raw.sensors.join(", ")
      : raw.sensors || "-",
    details: raw.details || "-",
    confidence: raw.confidence ?? undefined,
  };
}

export async function getPatientSensorEvents(
  clinicId: string,
  userId: string,
): Promise<IParkinsonSensorEvent[]> {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/patients/${userId}/sensor-events/`,
  );

  const events = Array.isArray(data) ? data : data.results ?? [];
  return events.map(mapSensorEventRaw);
}
