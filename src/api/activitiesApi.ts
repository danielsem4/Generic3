import api from "@/lib/axios";

// --- Interfaces ---

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



export interface IAssignActivityData {
  activity_id: string;
  doctor_user_id: string;
}

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
