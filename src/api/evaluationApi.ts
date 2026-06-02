import api from "@/lib/axios";
import type { IEvaluation } from "@/common/types/evaluation";
import { type EvaluationType } from "@/common/types/evaluation";
import type {
  BackendStructurePayload,
  IServerStructureResponse,
} from "@/screens/evaluations/lib/transformStructure";

export interface ICreateEvaluationPayload {
  evaluation_name: string;
  type: string;
  is_public: boolean;
}

export interface IUpdateEvaluationPayload {
  evaluation_name?: string;
  type?: string;
  is_public?: boolean;
  is_active?: boolean;
}

interface IEvaluationRaw {
  id: string;
  clinic: string;
  evaluation: string;
  evaluation_name: string;
  evaluation_type: string;
  type?: string;
  is_public: boolean;
  is_active: boolean;
}

function mapRawToEvaluation(raw: IEvaluationRaw): IEvaluation {
  return {
    id: raw.evaluation,
    name: raw.evaluation_name,
    type: raw.evaluation_type as EvaluationType,
    isPublic: raw.is_public,
    isActive: raw.is_active,
    clinicId: raw.clinic,
    screens: [],
  };
}

function mapRawPublicEvaluation(raw: IEvaluationRaw): IEvaluation {
  return {
    id: raw.id,
    name: raw.evaluation_name,
    type: (raw.evaluation_type ?? raw.type) as EvaluationType,
    isPublic: raw.is_public,
    isActive: raw.is_active,
    clinicId: raw.clinic,
    screens: [],
  };
}

export async function fetchEvaluations(
  clinicId: string,
): Promise<IEvaluation[]> {
  const response = await api.get<IEvaluationRaw[]>(
    `/api/v1/clinics/${clinicId}/evaluations/`,
  );
  return response.data.map(mapRawToEvaluation);
}

export const createEvaluation = async (
  clinicId: string,
  data: ICreateEvaluationPayload,
) => {
  const response = await api.post(
    `/api/v1/clinics/${clinicId}/evaluations/`,
    data,
  );
  return response.data;
};

export async function deleteEvaluation(
  clinicId: string,
  evaluationId: string,
): Promise<void> {
  await api.delete(
    `/api/v1/clinics/${clinicId}/evaluations/${evaluationId}/`,
  );
}

export async function updateEvaluation(
  clinicId: string,
  evaluationId: string,
  data: IUpdateEvaluationPayload,
): Promise<IEvaluationRaw> {
  const response = await api.patch<IEvaluationRaw>(
    `/api/v1/clinics/${clinicId}/evaluations/${evaluationId}/`,
    data,
  );
  return response.data;
}

export async function fetchPublicEvaluations(): Promise<IEvaluation[]> {
  const response = await api.get<IEvaluationRaw[]>(
    `/api/v1/evaluations/?is_public=true`,
  );
  return response.data.map(mapRawPublicEvaluation);
}

export async function adoptEvaluation(
  clinicId: string,
  evaluationId: string,
): Promise<void> {
  await api.post(`/api/v1/clinics/${clinicId}/evaluations/`, {
    evaluation: evaluationId,
  });
}

export async function saveEvaluationStructure(
  clinicId: string,
  evaluationId: string,
  payload: BackendStructurePayload,
): Promise<void> {
  await api.post(
    `/api/v1/clinics/${clinicId}/evaluations/${evaluationId}/structure/`,
    payload,
  );
}

export async function fetchEvaluationStructure(
  clinicId: string,
  evaluationId: string,
): Promise<IServerStructureResponse> {
  const response = await api.get<IServerStructureResponse>(
    `/api/v1/clinics/${clinicId}/evaluations/${evaluationId}/structure/`,
  );
  return response.data;
}
