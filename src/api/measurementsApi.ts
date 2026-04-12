import api from "@/lib/axios";
import type { IMeasurement } from "@/common/types/measurement";
import { type MeasurementType } from "@/common/types/measurement";

export interface ICreateMeasurementPayload {
  measurement_name: string;
  type: string;
  is_public: boolean;
}

interface IMeasurementRaw {
  id: string;
  clinic: string;
  measurement: string;
  measurement_name: string;
  measurement_type: string;
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
