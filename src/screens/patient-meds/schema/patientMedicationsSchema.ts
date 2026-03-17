// Define exactly as the professor's table
export interface IPatientMedicine {
  medicine: string;        
  patient: string;        
  clinic: string;          
  doctor: string;          
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  frequency_data: string[]; 
  start_date: string;     
  end_date: string;     
  dosage: string;         
  medName?: string;  
  medForm?: string;       
}

// Interface for the actual intake history
export interface IIntakeLog {
  intakeDate: string;
  intakeTime: string;
  medicineId: string;
  medName: string;
  medForm: string;
  dosage: string;
}

export interface ISelectedMed {
  id: string;
  medName: string;
  medForm: string;
}

export interface IMedicationHookData {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  setFrequency: (f: 'once' | 'daily' | 'weekly' | 'monthly') => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  dosageAmount: string;
  setDosageAmount: (a: string) => void;
  dosageUnit: string;
  setDosageUnit: (u: string) => void;
  timeSlots: string[];
  addTimeSlot: () => void;
  removeTimeSlot: (index: number) => void;
  selectedMed: ISelectedMed | null;
  setSelectedMed: (med: ISelectedMed | null) => void;
  handleFinalize: () => void
  selectedDays: string[];             
  selectedWeeks: string[];            
  toggleDay: (day: string) => void;   
  toggleWeek: (week: string) => void;
}