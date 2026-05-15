import api from "@/lib/axios";

const buildParams = (startDate?: string, endDate?: string) => ({
  ...(startDate ? { start_date: startDate } : {}),
  ...(endDate ? { end_date: endDate } : {}),
});

export interface UsageItem {
  name: string;
  count: number;
}

export interface BusiestDayItem {
  day: string;
  count: number;
}

export interface MeasurementsSummary {
  number_of_measurements: number;
  most_used: string | null;
  most_unused: string | null;
  total_submissions: number;
}

export interface AvgCompletionTimeItem {
  measurement_name: string;
  avg_completion_time_seconds: number;
}

export interface AvgScoreItem {
  measurement_name: string;
  avg_score: number | null;
}

export const getActivitiesUsage = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<UsageItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/activities/usage/`,
    { params: buildParams(startDate, endDate) }
  );

  return data.map((item: { activity_name: string; usage_count: number }) => ({
    name: item.activity_name,
    count: item.usage_count,
  }));
};

export const getActivitiesBusiestDays = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<BusiestDayItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/activities/busiest-days/`,
    { params: buildParams(startDate, endDate) }
  );

  return data;
};

export const getMedicationsUsage = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<UsageItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/medications/usage/`,
    { params: buildParams(startDate, endDate) }
  );

  return data.map((item: { medication_name: string; usage_count: number }) => ({
    name: item.medication_name,
    count: item.usage_count,
  }));
};

export const getMedicationsBusiestDays = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<BusiestDayItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/medications/busiest-days/`,
    { params: buildParams(startDate, endDate) }
  );

  return data;
};

export const getMeasurementsSummary = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<MeasurementsSummary> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/measurements/summary/`,
    { params: buildParams(startDate, endDate) }
  );

  return data;
};

export const getMeasurementsUsage = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<UsageItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/measurements/usage/`,
    { params: buildParams(startDate, endDate) }
  );

  return data.map(
    (item: { measurement_name: string; submission_count: number }) => ({
      name: item.measurement_name,
      count: item.submission_count,
    })
  );
};

export const getMeasurementsBusiestDays = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<BusiestDayItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/measurements/busiest-days/`,
    { params: buildParams(startDate, endDate) }
  );

  return data;
};

export const getMeasurementsAvgCompletionTime = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<AvgCompletionTimeItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/measurements/avg-completion-time/`,
    { params: buildParams(startDate, endDate) }
  );

  return data;
};

export const getMeasurementsAvgScore = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<AvgScoreItem[]> => {
  const { data } = await api.get(
    `/api/v1/clinics/${clinicId}/analytics/measurements/avg-score/`,
    { params: buildParams(startDate, endDate) }
  );

  return data;
};