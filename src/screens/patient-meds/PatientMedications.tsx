import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePatientMedications } from "./hooks/usePatientMedications";
import { MedicationCard } from "./components/MedicationCard";
import { IntakeLogTable } from "./components/IntakeLogTable";
import { AddMedicationModal } from "./components/AddMedicationModal";

export default function PatientMedications() {
  const { t, i18n } = useTranslation();
  const { searchTerm, setSearchTerm, filteredPrescriptions, handleDelete, isAddModalOpen, setIsAddModalOpen, intakeLogs} = usePatientMedications("123");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-4 space-y-6 bg-background min-h-screen text-left" dir={i18n.dir()}>
      
      {/* Search Bar Container */}
      <div className="flex justify-center max-w-4xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            value={searchTerm} 
            onChange={handleSearchChange}
            className="pl-10 h-10 bg-card border-border rounded-lg text-sm" 
            placeholder={t("patientMeds.searchPlaceholder")} 
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Title and Add Button */}
        <div className="flex justify-between items-center border-b border-border pb-2">
           <div className="flex items-center gap-2 text-foreground font-bold">
             <Pill className="text-primary rotate-45" size={20} />
             <span>{t("patientMeds.title")}</span>
           </div>
           <button 
           onClick={openAddModal}
           className="text-primary text-sm font-semibold hover:underline cursor-pointer">
             + {t("patientMeds.addMedication")}
           </button>
        </div>

        {/* List of Medications */}
        <div className="space-y-2">
          {filteredPrescriptions.map((pres) => (
            <MedicationCard 
            key={pres.medicine} 
            prescription={pres} 
            onDelete={handleDelete} />
          ))}
        </div>

        {/* History Table */}
        <IntakeLogTable intakeLogs={intakeLogs}/>
      </div>

      {/* Add Medication Modal */}
      <AddMedicationModal 
        isOpen={isAddModalOpen} 
        setIsOpen={setIsAddModalOpen} 
      />
    </div>
  );
}