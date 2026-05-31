import axios from "axios";

export type NotificationType = "MEDICATION" | "ACTIVITY" | "MEASUREMENT";

interface NotifyParams {
  clinicId: string;
  userId: string;
  type: NotificationType;
  objectId: string;
}

export async function sendPatientNotification({ clinicId, userId, type, objectId }: NotifyParams) {
  const response = await axios.post(
    `/api/v1/clinics/${clinicId}/patients/${userId}/notify/`,
    {
      type: type.toUpperCase(),
      object_id: objectId, 
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}