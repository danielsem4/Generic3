import api from "@/lib/axios";
import type { IClinicActivity, IGlobalActivity } from "@/common/types/activities";

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
