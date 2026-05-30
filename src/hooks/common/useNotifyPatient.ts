import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { sendPatientNotification, type NotificationType } from "@/api/patientNotificationsApi";

interface NotifyPayload {
  type: NotificationType;
  objectId: string;
}

export function useNotifyPatient() {
  const params = useParams<Record<string, string>>();
  const clinicId = useAuthStore((s) => s.clinicId);

  return useMutation({
    mutationFn: async ({ type, objectId }: NotifyPayload) => {
      const currentUserId = params.id || params.patientId || params.userId;


      if (!clinicId || !currentUserId) {
        throw new Error("Missing clinicId or userId");
      }

      return sendPatientNotification({
        clinicId,
        userId: currentUserId,
        type,
        objectId,
      });
    },
    onSuccess: () => {
      toast.success("Notification sent successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to send notification");
      console.error("Notification error:", error);
    },
  });
}