import { useState, useMemo } from "react";
import type { PatientMedicine, IntakeLog } from "../schema/patientMedicationsSchema";

export function usePatientMedications(patientId: string) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [intakeLogs] = useState<IntakeLog[]>([
    { 
      intakeDate: "2026-03-11", 
      intakeTime: "09:00", 
      medName: "METHYLDOPA 250MG TAB", 
      dosage: "250mg", 
      medicineId: "1999021347", 
      medForm: "TAB" 
    }
  ]);
  
  const [prescriptions, setPrescriptions] = useState<PatientMedicine[]>([
    {
      medicine: "1999021347",
      patient: patientId, 
      clinic: "Gan Yavne Clinic",
      doctor: "Dr. Cohen",
      frequency: "daily",
      frequency_data: ["09:02"],
      start_date: "2026-03-11",
      end_date: "2100-12-31",
      dosage: "250mg",
      medName: "METHYLDOPA 250MG TAB",
      medForm: "TAB"
    }
  ]);

  const [selectedMed, setSelectedMed] = useState<{id: string, medName: string, medForm: string} | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("2100-12-31");
  const [dosageAmount, setDosageAmount] = useState("1");
  const [dosageUnit, setDosageUnit] = useState("ml");
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

 const handleDelete = (medId: string) => {
  setPrescriptions(prev => prev.filter(p => p.medicine !== medId));
};
  

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(p => 
      p.patient === patientId && 
      p.medName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, patientId, prescriptions]);

  const handleFinalize = () => {
    if (!selectedMed) return;
    const newMed: PatientMedicine = {
      medicine: selectedMed.id,
      patient: patientId,
      clinic: "Clinic_1",
      doctor: "Doc_1",
      frequency,
      frequency_data: frequency === 'monthly' ? [...selectedWeeks, ...selectedDays] : timeSlots,      
      start_date: startDate,
      end_date: endDate,
      dosage: `${dosageAmount} ${dosageUnit}`,
      medName: selectedMed.medName
    };
    setPrescriptions([...prescriptions, newMed]);
    setIsAddModalOpen(false);
    setSelectedMed(null);
    setFrequency('daily');
  };

  const toggleSelection = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
};
  const toggleWeek = (week: string) => {
  setSelectedWeeks([week]); 
};


  return {
    // states
    frequency, setFrequency,
    selectedDays, 
    selectedWeeks,
    timeSlots,
    searchTerm, setSearchTerm, filteredPrescriptions, intakeLogs,
    isAddModalOpen, setIsAddModalOpen,
    selectedMed, setSelectedMed,
    startDate, setStartDate, endDate, setEndDate,
    dosageAmount, setDosageAmount, dosageUnit, setDosageUnit,
    
    // functions
    toggleDay: (day: string) => toggleSelection(day, selectedDays, setSelectedDays),
    toggleWeek,
    addTimeSlot: () => setTimeSlots([...timeSlots, "12:00"]),
    removeTimeSlot: (index: number) => setTimeSlots(timeSlots.filter((_, i) => i !== index)),
    handleFinalize,
    handleDelete,
  };
}