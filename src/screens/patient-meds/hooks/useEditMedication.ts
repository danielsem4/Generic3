import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatientMedication } from "@/api/medicationService";
import { useAuthStore } from "@/store/useAuthStore";
import { buildFrequencyData } from "@/common/libs/buildFrequencyData";
import type {
  IPatientPrescription,
  PrescriptionFrequency,
} from "@/common/types/Medication";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";



export function useEditMedication(patientId: string) {
  const clinicId = useAuthStore((state) => state.clinicId);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [dosageAmount, setDosageAmount] = useState("1");
  const [dosageUnit, setDosageUnit] = useState("ml");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState<PrescriptionFrequency>("DAILY");

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(["12:00"]);
  const [dayOfMonth, setDayOfMonth] = useState("1");

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

      if (
        (frequency === "WEEKLY" || frequency === "MONTHLY") &&
        next.length === 0
      ) {
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
  const parseDosage = (dosage?: string) => {
  if (!dosage) {
    return { amount: "1", unit: "ml" };
  }

  const [amount, unit] = dosage.trim().split(/\s+/);

  return {
    amount: amount || "1",
    unit: unit || "ml",
  };
};
  const initForm = useCallback((prescription: IPatientPrescription) => {
    const parsedDosage = parseDosage(prescription.dosage);
    setDosageAmount(parsedDosage.amount);
    setDosageUnit(parsedDosage.unit);
    setStartDate(prescription.start_date ?? "");
    setEndDate(prescription.end_date ?? "");
    setFrequency(prescription.frequency ?? "DAILY");

    if (prescription.frequency === "WEEKLY") {
      setSelectedDays(prescription.frequency_data?.days_of_week ?? []);
      setTimeSlots([
        prescription.frequency_data?.time ??
          prescription.frequency_data?.time_slots?.[0] ??
          "12:00",
      ]);
      setDayOfMonth("1");
      return;
    }

    if (prescription.frequency === "MONTHLY") {
      setSelectedDays([]);
      setDayOfMonth(String(prescription.frequency_data?.day_of_month ?? "1"));
      setTimeSlots([
        prescription.frequency_data?.time ??
          prescription.frequency_data?.time_slots?.[0] ??
          "12:00",
      ]);
      return;
    }

    setSelectedDays([]);
    setDayOfMonth("1");
    setTimeSlots(
      prescription.frequency_data?.time_slots?.length
        ? prescription.frequency_data.time_slots
        : ["12:00"],
    );
  }, []);

  const { mutate: submitEdit, isPending } = useMutation({
    mutationFn: (prescriptionId: string) => {
      const frequency_data = buildFrequencyData({
        frequency,
        startDate,
        timeSlots,
        selectedDays,
        dayOfMonth,
        defaultTime: "12:00",
      });

      return updatePatientMedication(clinicId!, patientId, prescriptionId, {
        dosage: `${dosageAmount} ${dosageUnit}`,
        start_date: startDate,
        end_date: endDate,
        frequency,
        frequency_data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-medications", clinicId, patientId],
      });
       toast.success(t("patientMeds.editSuccess"));
   },
       onError: () => {
          toast.error(t("patientMeds.editError"));
    },
  });

  return {
    dosageAmount,
    setDosageAmount,

    dosageUnit,
    setDosageUnit,

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