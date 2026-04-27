import { useState,useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import type { IPatientActivity } from "@/common/types/activities";
import { editPatientActivity } from "@/api/activitiesApi";
import { buildFrequencyData } from "@/common/libs/buildFrequencyData";

type TFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export function useEditActivity(patientId: string) {
  const { t } = useTranslation();
  const clinicId = useAuthStore((state) => state.clinicId);
  const doctor_user_id = useAuthStore((state) => state.userId);
  const queryClient = useQueryClient();

  const [activityId, setActivityId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState<TFrequency>("DAILY");

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(["12:00"]);
  const [dayOfMonth, setDayOfMonth] = useState("");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const addTimeSlot = () => {
    setTimeSlots((prev) => {
      if (frequency === "WEEKLY" || frequency === "MONTHLY") {
        if (prev.length >= 1) return prev;
        return ["12:00"];
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

  const initForm = useCallback((activity: IPatientActivity) => {
    setActivityId(activity.id);
    setStartDate(activity.start_date ?? "");
    setEndDate(activity.end_date ?? "");
    setFrequency(activity.frequency);

    if (activity.frequency === "ONCE") {
      setTimeSlots(
        activity.frequency_data.time_slots?.length
          ? activity.frequency_data.time_slots
          : ["12:00"],
      );
      setSelectedDays([]);
      setDayOfMonth("");
      return;
    }

    if (activity.frequency === "DAILY") {
      setTimeSlots(
        activity.frequency_data.time_slots?.length
          ? activity.frequency_data.time_slots
          : ["12:00"],
      );
      setSelectedDays([]);
      setDayOfMonth("");
      return;
    }

    if (activity.frequency === "WEEKLY") {
      setSelectedDays(activity.frequency_data.days_of_week ?? []);
      setTimeSlots([activity.frequency_data.time ?? "12:00"]);
      setDayOfMonth("");
      return;
    }

    if (activity.frequency === "MONTHLY") {
      setDayOfMonth(String(activity.frequency_data.day_of_month ?? ""));
      setTimeSlots([activity.frequency_data.time ?? "12:00"]);
      setSelectedDays([]);
    }
  }, []);

  const { mutate: submitEdit, isPending } = useMutation({
    mutationFn: () => {
      if (!clinicId || !doctor_user_id || !activityId) {
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

      return editPatientActivity(clinicId, patientId, activityId, {
        doctor_user_id,
        start_date: startDate,
        end_date: endDate,
        frequency,
        frequency_data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-activities", clinicId, patientId],
      });
      toast.success(t("patientActivities.editActivity.editSuccess"));
    },
    onError: () => {
      toast.error(t("patientActivities.editActivity.editError"));
    },
  });

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    frequency,
    setFrequency,
    selectedDays,
    toggleDay,
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    dayOfMonth,
    setDayOfMonth,
    initForm,
    submitEdit,
    isPending,
  };
}