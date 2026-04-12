import api from "@/lib/axios";
import type { IClinicActivity, IGlobalActivity, IPatientActivity, IActivityLog, IActivityLogFilters } from "@/common/types/activities";

export const getClinicActivities = async (clinicId: string): Promise<IClinicActivity[]> => {
  const response = await api.get(`/api/v1/clinics/${clinicId}/activities/`);
  return response.data;
};

export const getAllSystemActivities = async (): Promise<IGlobalActivity[]> => {
  const response = await api.get(`/api/v1/activities/`);
  return response.data;
};

export const getActivityById = async (activityId: string): Promise<IGlobalActivity> => {
  const response = await api.get(`/api/v1/activities/${activityId}/`);
  return response.data;
};

export const createActivity = async (data: {
  activity_name: string;
  activity_description: string;
}): Promise<IGlobalActivity> => {
  const response = await api.post("/api/v1/activities/", data);
  return response.data;
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  await api.delete(`/api/v1/activities/${activityId}/`);
};

export const getPatientActivities = async (clinicId: string,userId: string,): Promise<IPatientActivity[]> => {
  const response = await api.get<IPatientActivity[]>(
    `/api/v1/clinics/${clinicId}/patients/${userId}/activities/`,
  );
  return response.data;
};

export const getPatientActivityLogs = async (
  clinicId: string,
  userId: string,
  filters?: IActivityLogFilters
): Promise<IActivityLog[]> => {
  const response = await api.get<IActivityLog[]>(
    `/api/v1/clinics/${clinicId}/patients/${userId}/activity-logs/`,
    { params: filters }
  );
  return response.data;
};


interface IAddPatientActivityPayload {
  activity_id: string;
  doctor_user_id: string;
  start_date?: string;
  end_date?: string;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  frequency_data: Record<string, unknown>;
}

export const addPatientActivity = async (
  clinicId: string,
  userId: string,
  payload: IAddPatientActivityPayload,
) => {
  const response = await api.post(
    `/api/v1/clinics/${clinicId}/patients/${userId}/activities/`,
    payload,
  );

  return response.data;
};

export const editPatientActivity = async (
  clinicId: string,
  userId: string,
  patientActivityId: string,
  payload: {
    activity?: string;
    doctor_user_id: string;
    start_date?: string;
    end_date?: string;
    frequency?: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
    frequency_data?: Record<string, unknown>;
  },
) => {
  const response = await api.patch(
    `/api/v1/clinics/${clinicId}/patients/${userId}/activities/${patientActivityId}/`,
    payload,
  );

  return response.data;
};

export const deletePatientActivity = async (
  clinicId: string,
  userId: string,
  patientActivityId: string,
): Promise<void> => {
  await api.delete(
    `/api/v1/clinics/${clinicId}/patients/${userId}/activities/${patientActivityId}/`,
  );
};