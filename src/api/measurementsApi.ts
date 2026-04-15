import api from "@/lib/axios";
import type { IMeasurement } from "@/common/types/measurement";
import { type MeasurementType } from "@/common/types/measurement";
import type {
  BackendStructurePayload,
  IServerStructureResponse,
} from "@/screens/measurements/lib/transformStructure";

export interface ICreateMeasurementPayload {
  measurement_name: string;
  type: string;
  is_public: boolean;
}

export interface IUpdateMeasurementPayload {
  measurement_name?: string;
  type?: string;
  is_public?: boolean;
  is_active?: boolean;
}

interface IMeasurementRaw {
  id: string;
  clinic: string;
  measurement: string;
  measurement_name: string;
  measurement_type: string;
  type?: string;
  is_public: boolean;
  is_active: boolean;
}

function mapRawToMeasurement(raw: IMeasurementRaw): IMeasurement {
  return {
    id: raw.measurement,
    name: raw.measurement_name,
    type: raw.measurement_type as MeasurementType,
    isPublic: raw.is_public,
    isActive: raw.is_active,
    clinicId: raw.clinic,
    screens: [],
  };
}

function mapRawPublicMeasurement(raw: IMeasurementRaw): IMeasurement {
  return {
    id: raw.id,
    name: raw.measurement_name,
    type: (raw.measurement_type ?? raw.type) as MeasurementType,
    isPublic: raw.is_public,
    isActive: raw.is_active,
    clinicId: raw.clinic,
    screens: [],
  };
}

export async function fetchMeasurements(
  clinicId: string,
): Promise<IMeasurement[]> {
  const response = await api.get<IMeasurementRaw[]>(
    `/api/v1/clinics/${clinicId}/measurements/`,
  );
  return response.data.map(mapRawToMeasurement);
}

export const createMeasurement = async (
  clinicId: string,
  data: ICreateMeasurementPayload,
) => {
  const response = await api.post(
    `/api/v1/clinics/${clinicId}/measurements/`,
    data,
  );
  return response.data;
};

export async function deleteMeasurement(
  clinicId: string,
  measurementId: string,
): Promise<void> {
  await api.delete(
    `/api/v1/clinics/${clinicId}/measurements/${measurementId}/`,
  );
}

export async function updateMeasurement(
  clinicId: string,
  measurementId: string,
  data: IUpdateMeasurementPayload,
): Promise<IMeasurementRaw> {
  const response = await api.patch<IMeasurementRaw>(
    `/api/v1/clinics/${clinicId}/measurements/${measurementId}/`,
    data,
  );
  return response.data;
}

export async function fetchPublicMeasurements(): Promise<IMeasurement[]> {
  const response = await api.get<IMeasurementRaw[]>(
    `/api/v1/measurements/?is_public=true`,
  );
  return response.data.map(mapRawPublicMeasurement);
}

export async function adoptMeasurement(
  clinicId: string,
  measurementId: string,
): Promise<void> {
  await api.post(`/api/v1/clinics/${clinicId}/measurements/`, {
    measurement: measurementId,
  });
}

export async function saveMeasurementStructure(
  clinicId: string,
  measurementId: string,
  payload: BackendStructurePayload,
): Promise<void> {
  await api.post(
    `/api/v1/clinics/${clinicId}/measurements/${measurementId}/structure/`,
    payload,
  );
}

export async function fetchMeasurementStructure(
  clinicId: string,
  measurementId: string,
): Promise<IServerStructureResponse> {
  const response = await api.get<IServerStructureResponse>(
    `/api/v1/clinics/${clinicId}/measurements/${measurementId}/structure/`,
  );
  return response.data;
}
