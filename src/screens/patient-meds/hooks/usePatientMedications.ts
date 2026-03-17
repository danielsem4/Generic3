import { useState } from "react";
import type { IPatientMedicine, IIntakeLog } from "../schema/patientMedicationsSchema";

  const INITIAL_INTAKE_LOGS: IIntakeLog[] = [
    { 
      intakeDate: "2026-03-11", 
      intakeTime: "09:00", 
      medName: "METHYLDOPA 250MG TAB", 
      dosage: "250mg", 
      medicineId: "1999021347", 
      medForm: "TAB" 
    }
  ];
  
const getInitialPrescriptions = (patientId: string): IPatientMedicine[] => [
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
  ];

  
export function usePatientMedications(patientId: string) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [intakeLogs] = useState<IIntakeLog[]>(INITIAL_INTAKE_LOGS);
  const [prescriptions, setPrescriptions] = useState<IPatientMedicine[]>(getInitialPrescriptions(patientId));

  const [selectedMed, setSelectedMed] = useState<{id: string, medName: string, medForm: string} | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("2100-12-31");
  const [dosageAmount, setDosageAmount] = useState("1");
  const [dosageUnit, setDosageUnit] = useState("ml");
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);


 const filteredPrescriptions = prescriptions.filter(p => 
    p.patient === patientId && 
    p.medName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (medId: string) => {
    setPrescriptions(prev => prev.filter(p => p.medicine !== medId));
  };

  const handleFinalize = () => {
    if (!selectedMed) return;
    const newMed: IPatientMedicine = {
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

 const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(i => i !== day) : [...prev, day]
    );
  };

  const toggleWeek = (week: string) => {
    setSelectedWeeks([week]); 
  };

  const addTimeSlot = () => {
    setTimeSlots(prev => [...prev, "12:00"]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };


  return {
    // states
    frequency, setFrequency,
    selectedDays, 
    selectedWeeks,
    timeSlots,
    searchTerm, setSearchTerm, 
    filteredPrescriptions, 
    intakeLogs,
    isAddModalOpen, setIsAddModalOpen,
    selectedMed, setSelectedMed,
    startDate, setStartDate, 
    endDate, setEndDate,
    dosageAmount, setDosageAmount, 
    dosageUnit, setDosageUnit,
    
    // functions
    toggleDay,
    toggleWeek,
    addTimeSlot,
    removeTimeSlot,
    handleFinalize,
    handleDelete,
  };
}


