import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  assignPatientMeasurement,
  type TMeasurementFrequency,
} from "@/api/patientMeasurementsApi";
import { useAuthStore } from "@/store/useAuthStore";
import { buildFrequencyData } from "@/common/libs/buildFrequencyData";

export function usePatientMeasurementSettingsDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { userId, measurementId } = useParams<{
    userId: string;
    measurementId: string;
  }>();

  const clinicId = useAuthStore((state) => state.clinicId);
  const doctorUserId = useAuthStore((state) => state.userId);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState<TMeasurementFrequency>("DAILY");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(["09:00"]);
  const [dayOfMonth, setDayOfMonth] = useState("");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const addTimeSlot = () => {
    setTimeSlots((prev) => [...prev, "09:00"]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    setTimeSlots((prev) =>
      prev.map((slot, i) => (i === index ? value : slot)),
    );
  };

  const { mutate: submitMeasurementSettings, isPending } = useMutation({
    mutationFn: async () => {
      if (!clinicId || !userId || !doctorUserId || !measurementId) {
        throw new Error("Missing clinicId, userId, doctorUserId or measurementId");
      }

      return assignPatientMeasurement(clinicId, userId, {
        measurement_id: measurementId,
        doctor_user_id: doctorUserId,
        start_date: startDate,
        end_date: endDate || undefined,
        frequency,
        frequency_data: buildFrequencyData({
          frequency,
          startDate,
          timeSlots,
          selectedDays,
          dayOfMonth,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-measurement-submissions", clinicId, userId],
      });
      toast.success(t("patientMeasurements.settings.success"));
      setIsSettingsOpen(false);
    },
    onError: () => {
      toast.error(t("patientMeasurements.settings.error"));
    },
  });

  return {
    isSettingsOpen,
    setIsSettingsOpen,
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
    submitMeasurementSettings,
    isPending,
  };
}