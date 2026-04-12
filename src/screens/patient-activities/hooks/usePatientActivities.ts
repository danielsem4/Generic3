import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  getPatientActivities,
  getClinicActivities,
  deletePatientActivity,
} from "@/api/activitiesApi";

export function usePatientActivities(clinicId: string, userId: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { mutate: submitDelete } = useMutation({
    mutationFn: (patientActivityId: string) =>
      deletePatientActivity(clinicId, userId, patientActivityId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-activities", clinicId, userId],
      });
      toast.success(t("patientActivities.deleteSuccess"));
    },

    onError: () => {
      toast.error(t("patientActivities.deleteError"));
    },
  });

  const handleDelete = (id: string) => {
    submitDelete(id);
  };

  const {
    data: patientActivities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["patient-activities", clinicId, userId],
    queryFn: () => getPatientActivities(clinicId, userId),
    enabled: !!clinicId && !!userId,
  });

  const { data: clinicActivities = [] } = useQuery({
    queryKey: ["clinic-activities", clinicId],
    queryFn: () => getClinicActivities(clinicId),
    enabled: !!clinicId,
  });

  const filteredActivities = patientActivities.filter((activity) =>
    activity.activity_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredActivities,
    isAddModalOpen,
    setIsAddModalOpen,
    patientActivities,
    clinicActivities,
    isLoading,
    error,
    handleDelete,
  };
}