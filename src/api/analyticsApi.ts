import api from "@/lib/axios";

const buildParams = (startDate?: string, endDate?: string) => ({
  ...(startDate ? { start_date: startDate } : {}),
  ...(endDate ? { end_date: endDate } : {}),
});

export interface AnalyticsUsageItem {
  name: string;
  count: number;
}

export interface BusiestDayItem {
  day: string;
  count: number;
}

// --- Measurements Interfaces ---
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

export interface MeasurementsAnalyticsResponse {
  summary: MeasurementsSummary;
  usage: AnalyticsUsageItem[];
  busiest_days: BusiestDayItem[];
  avg_completion_time: AvgCompletionTimeItem[];
  avg_score: AvgScoreItem[];
}

// --- Medications Interfaces ---
export interface MedicationsSummary {
  number_of_medications: number;
  most_used: string | null;
  most_unused: string | null;
  total_logs: number;
}

export interface MedicationsAnalyticsResponse {
  summary: MedicationsSummary;
  usage: AnalyticsUsageItem[];
  busiest_days: BusiestDayItem[];
}

// --- Activities Interfaces ---
export interface ActivitiesSummary {
  number_of_activities: number;
  most_used: string | null;
  most_unused: string | null;
  total_logs: number;
}

export interface ActivitiesAnalyticsResponse {
  summary: ActivitiesSummary;
  usage: AnalyticsUsageItem[];
  busiest_days: BusiestDayItem[];
}

// API Calls
export const getMeasurementsAnalytics = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<MeasurementsAnalyticsResponse> => {
  const { data } = await api.get(`/api/v1/clinics/${clinicId}/analytics/measurements/`, {
    params: buildParams(startDate, endDate),
  });

  return {
    ...data,
    usage: data.usage.map((item: { measurement_name: string; submission_count: number }) => ({
      name: item.measurement_name,
      count: item.submission_count,
    })),
  };
};


export const getMedicationsAnalytics = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<MedicationsAnalyticsResponse> => {
  const { data } = await api.get(`/api/v1/clinics/${clinicId}/analytics/medications/`, {
    params: buildParams(startDate, endDate),
  });

  return {
    ...data,
    usage: data.usage.map((item: { medication_name: string; usage_count: number }) => ({
      name: item.medication_name,
      count: item.usage_count,
    })),
  };
};


export const getActivitiesAnalytics = async (
  clinicId: string,
  startDate?: string,
  endDate?: string
): Promise<ActivitiesAnalyticsResponse> => {
  const { data } = await api.get(`/api/v1/clinics/${clinicId}/analytics/activities/`, {
    params: buildParams(startDate, endDate),
  });

  return {
    ...data,
    usage: data.usage.map((item: { activity_name: string; usage_count: number }) => ({
      name: item.activity_name,
      count: item.usage_count,
    })),
  };
};