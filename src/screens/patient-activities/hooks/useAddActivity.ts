import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import type { IClinicActivity } from "@/common/types/activities";
import { addPatientActivity } from "@/api/activitiesApi";
import { buildFrequencyData } from "@/common/libs/buildFrequencyData";

type TFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export function useAddActivity(clinicId: string, userId: string) {
  const { t } = useTranslation();
  const doctorId = useAuthStore((state) => state.userId);
  const queryClient = useQueryClient();

  const [selectedActivity, setSelectedActivity] =
    useState<IClinicActivity | null>(null);

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState("2100-12-31");
  const [frequency, setFrequency] = useState<TFrequency>("DAILY");

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(["12:00"]);
  const [dayOfMonth, setDayOfMonth] = useState("");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((i) => i !== day) : [...prev, day],
    );
  };

  const addTimeSlot = () => {
    setTimeSlots((prev) => {
      if (frequency === "WEEKLY" || frequency === "MONTHLY") {
        return prev.length >= 1 ? prev : ["12:00"];
      }

      return [...prev, "12:00"];
    });
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots((prev) => {
      const next = prev.filter((_, i) => i !== index);

      if ((frequency === "WEEKLY" || frequency === "MONTHLY") && next.length === 0) {
        return ["12:00"];
      }

      return next;
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    setTimeSlots((prev) => {
      if (frequency === "WEEKLY" || frequency === "MONTHLY") {
        return [value];
      }

      return prev.map((slot, i) => (i === index ? value : slot));
    });
  };

  const resetForm = () => {
    setSelectedActivity(null);
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("2100-12-31");
    setFrequency("DAILY");
    setSelectedDays([]);
    setTimeSlots(["12:00"]);
    setDayOfMonth("");
  };

  const { mutate: submitAdd, isPending: isAddPending } = useMutation({
    mutationFn: () => {
      if (!selectedActivity || !doctorId) {
        throw new Error("Missing required identifiers");
      }

      const frequency_data = buildFrequencyData({
         frequency,
         startDate,
         timeSlots,
         selectedDays,
         dayOfMonth,
         defaultTime: "12:00",
    });

      return addPatientActivity(clinicId, userId, {
        activity_id: selectedActivity.activity,
        doctor_user_id: doctorId,
        start_date: startDate,
        end_date: endDate,
        frequency,
        frequency_data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-activities", clinicId, userId],
      });
      resetForm();
      toast.success(t("patientActivities.addActivity.addSuccess"));
    },
    onError: () => {
      toast.error(t("patientActivities.addActivity.addError"));
    },
  });

  const handleFinalize = (closeModal: () => void) => {
    if (!selectedActivity || !doctorId) return;
    submitAdd(undefined, { onSuccess: closeModal });
  };

  return {
    selectedActivity,setSelectedActivity,
    startDate,setStartDate,
    endDate,setEndDate,
    frequency,setFrequency,
    selectedDays,toggleDay,
    timeSlots,addTimeSlot,
    removeTimeSlot,updateTimeSlot,
    dayOfMonth,
    setDayOfMonth,
    handleFinalize,
    isAddPending,
    resetForm,
  };
}