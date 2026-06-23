import api from "@/lib/axios";
import type {
  IGraph,
  IAxisConfig,
  IGraphStructure,
  IGraphData,
  IRawDataPoint,
} from "@/common/types/graph";

interface IAxisConfigRaw {
  label?: string | null;
  source: string;
  element_id?: string | null;
}

interface IGraphRaw {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  clinic?: string;
}

export interface IGraphMetaPayload {
  name: string;
  description?: string;
  is_active?: boolean;
}

interface IStructureRaw {
  evaluation_id?: string;
  evaluation?: { id: string; evaluation_name?: string } | null;
  x_axis: IAxisConfigRaw;
  y_axis: IAxisConfigRaw;
}

interface IDataResponseRaw {
  evaluation?: { evaluation_name?: string } | null;
  x_axis?: IAxisConfigRaw;
  y_axis?: IAxisConfigRaw;
  points: IRawDataPoint[];
}

function mapRawToGraph(raw: IGraphRaw): IGraph {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    isActive: raw.is_active,
    clinicId: raw.clinic,
  };
}

function mapRawAxis(raw: IAxisConfigRaw): IAxisConfig {
  return {
    source: raw.source as IAxisConfig["source"],
    elementId: raw.element_id ?? undefined,
    label: raw.label ?? undefined,
  };
}

function mapAxisToRaw(axis: IAxisConfig): IAxisConfigRaw {
  return {
    label: axis.label ?? null,
    source: axis.source,
    element_id: axis.source === "ELEMENT_ANSWER" ? (axis.elementId ?? null) : null,
  };
}

export function buildStructurePayload(structure: IGraphStructure) {
  return {
    evaluation_id: structure.evaluationId,
    x_axis: mapAxisToRaw(structure.xAxis),
    y_axis: mapAxisToRaw(structure.yAxis),
  };
}

export async function fetchGraphs(clinicId: string): Promise<IGraph[]> {
  const response = await api.get<IGraphRaw[]>(
    `/api/v1/clinics/${clinicId}/graphs/`,
  );
  return response.data.map(mapRawToGraph);
}

export async function createGraph(
  clinicId: string,
  data: IGraphMetaPayload,
): Promise<IGraph> {
  const response = await api.post<IGraphRaw>(
    `/api/v1/clinics/${clinicId}/graphs/`,
    data,
  );
  return mapRawToGraph(response.data);
}

export async function updateGraph(
  clinicId: string,
  graphId: string,
  data: IGraphMetaPayload,
): Promise<IGraph> {
  const response = await api.patch<IGraphRaw>(
    `/api/v1/clinics/${clinicId}/graphs/${graphId}/`,
    data,
  );
  return mapRawToGraph(response.data);
}

export async function deleteGraph(
  clinicId: string,
  graphId: string,
): Promise<void> {
  await api.delete(`/api/v1/clinics/${clinicId}/graphs/${graphId}/`);
}

export async function fetchGraphStructure(
  clinicId: string,
  graphId: string,
): Promise<IGraphStructure> {
  const response = await api.get<IStructureRaw>(
    `/api/v1/clinics/${clinicId}/graphs/${graphId}/structure/`,
  );
  const raw = response.data;
  return {
    evaluationId: raw.evaluation?.id ?? raw.evaluation_id ?? "",
    evaluationName: raw.evaluation?.evaluation_name,
    xAxis: mapRawAxis(raw.x_axis),
    yAxis: mapRawAxis(raw.y_axis),
  };
}

export async function saveGraphStructure(
  clinicId: string,
  graphId: string,
  structure: IGraphStructure,
): Promise<void> {
  await api.post(
    `/api/v1/clinics/${clinicId}/graphs/${graphId}/structure/`,
    buildStructurePayload(structure),
  );
}

export interface IGraphDataParams {
  patientId: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchGraphData(
  clinicId: string,
  graphId: string,
  { patientId, startDate, endDate }: IGraphDataParams,
): Promise<IGraphData> {
  const response = await api.get<IDataResponseRaw>(
    `/api/v1/clinics/${clinicId}/graphs/${graphId}/data/`,
    {
      params: {
        patient_id: patientId,
        start_date: startDate,
        end_date: endDate,
      },
    },
  );
  const raw = response.data;
  return {
    points: raw.points ?? [],
    xLabel: raw.x_axis?.label ?? undefined,
    yLabel: raw.y_axis?.label ?? undefined,
    evaluationName: raw.evaluation?.evaluation_name,
  };
}
