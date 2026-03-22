import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  fetchPatientMedications,
  fetchClinicMedications,
  addPatientMedication,
  deletePatientMedication,
} from "@/api/medicationService";
import { useAuthStore } from "@/store/useAuthStore";
import type { PrescriptionFrequency } from "@/common/types/Medication";
import type { ISelectedMed } from "../schema/patientMedicationsSchema";

export function usePatientMedications(userId: string) {
  const { t } = useTranslation();
  const clinicId = useAuthStore((state) => state.clinicId);
  const doctorId = useAuthStore((state) => state.userId);
  const queryClient = useQueryClient();

  const { data: serverPrescriptions = [] } = useQuery({
    queryKey: ["patient-medications", clinicId, userId],
    queryFn: () => fetchPatientMedications(clinicId!, userId),
    enabled: !!clinicId && !!userId,
  });

  const { data: clinicMedications = [] } = useQuery({
    queryKey: ["clinic-medications", clinicId],
    queryFn: () => fetchClinicMedications(clinicId!),
    enabled: !!clinicId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedMed, setSelectedMed] = useState<ISelectedMed | null>(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState("2100-12-31");
  const [dosageAmount, setDosageAmount] = useState("1");
  const [dosageUnit, setDosageUnit] = useState("ml");
  const [frequency, setFrequency] = useState<
    "once" | "daily" | "weekly" | "monthly"
  >("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const filteredPrescriptions = serverPrescriptions.filter((p) =>
    p.med_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deletePatientMedication(clinicId!, userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-medications", clinicId, userId],
      });
    },
  });

  const { mutate: submitAdd, isPending: isAddPending } = useMutation({
    mutationFn: () => {
      const freq = frequency.toUpperCase() as PrescriptionFrequency;
      const frequency_data =
        freq === "WEEKLY"
          ? { time_slots: timeSlots, days_of_week: selectedDays }
          : freq === "MONTHLY"
            ? { weeks_of_month: selectedWeeks, days_of_week: selectedDays }
            : { time_slots: timeSlots, times_per_day: timeSlots.length };
      console.log({
        sendingData: {
          medication: selectedMed!.id,
          start_date: startDate,
          end_date: endDate,
          dosage: `${dosageAmount} ${dosageUnit}`,
          frequency: freq,
          frequency_data,
        },
      });

      return addPatientMedication(clinicId!, userId, {
        medication_id: selectedMed!.id,
        doctor_user_id: doctorId!,
        start_date: startDate,
        end_date: endDate,
        dosage: `${dosageAmount} ${dosageUnit}`,
        frequency: freq,
        frequency_data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-medications", clinicId, userId],
      });
      setSelectedMed(null);
      setFrequency("daily");
      setTimeSlots([]);
      setSelectedDays([]);
      setSelectedWeeks([]);
      toast.success(t("patientMeds.addSuccess"));
    },
    onError: () => {
      toast.error(t("patientMeds.addError"));
    },
  });

  const handleFinalize = (closeModal: () => void) => {
    if (!selectedMed) return;
    submitAdd(undefined, { onSuccess: closeModal });
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((i) => i !== day) : [...prev, day],
    );
  };

  const toggleWeek = (week: string) => {
    setSelectedWeeks([week]);
  };

  const addTimeSlot = () => {
    setTimeSlots((prev) => [...prev, "12:00"]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    // states
    clinicMedications,
    frequency,
    setFrequency,
    selectedDays,
    selectedWeeks,
    timeSlots,
    searchTerm,
    setSearchTerm,
    filteredPrescriptions,
    isAddModalOpen,
    setIsAddModalOpen,
    isAddPending,
    selectedMed,
    setSelectedMed,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dosageAmount,
    setDosageAmount,
    dosageUnit,
    setDosageUnit,

    // functions
    toggleDay,
    toggleWeek,
    addTimeSlot,
    removeTimeSlot,
    handleFinalize,
    handleDelete,
  };
}
