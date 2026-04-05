import api from "@/lib/axios";

export interface IGlobalActivity {
  id: string;
  activity_name: string;
  activity_description: string;
}

export interface IClinicActivity extends IGlobalActivity {
  clinic: string;
  activity: string; 
  is_active: boolean;
}


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

