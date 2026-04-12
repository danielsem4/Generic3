import api from "@/lib/axios";
import type { IClinicActivity, IGlobalActivity } from "@/common/types/activities";

// --- Interfaces ---
export interface IAssignActivityData {
  activity_id: string;
  doctor_user_id: string;
}

// --- API Functions ---
export const getAllSystemActivities = async (): Promise<IGlobalActivity[]> => {
  const response = await api.get(`/api/v1/activities/`);
  return response.data;
};

export const addActivityToClinic = async (clinicId: string, activityId: string) => {
  return await api.post(`/api/v1/clinics/${clinicId}/activities/`, {
    activity_id: activityId,
  });
};

export const removeActivityFromClinic = async (clinicId: string, activityId: string) => {
  const response = await api.delete(`/api/v1/clinics/${clinicId}/activities/${activityId}/`);
  return response.data;
};

export const assignActivityToPatient = async (
  clinicId: string, 
  userId: string, 
  data: IAssignActivityData
) => {
  const response = await api.post(
    `/api/v1/clinics/${clinicId}/patients/${userId}/activities/`, 
    data
  );
  return response.data;
};

export const getClinicActivities = async (clinicId: string): Promise<IClinicActivity[]> => {
  const response = await api.get(`/api/v1/clinics/${clinicId}/activities/`);
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