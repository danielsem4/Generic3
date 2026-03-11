import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Clock, Trash2, Plus, Pill, CheckCircle2, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePatientMedications } from "../hooks/usePatientMedications";

// Defining the frequency type to avoid 'any'
type FrequencyType = 'once' | 'daily' | 'weekly' | 'monthly';

interface AddMedicationModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
export function AddMedicationModal({ isOpen, setIsOpen }: AddMedicationModalProps) {
  const { t } = useTranslation();
  
  // Important: We use the props for open/close, and the hook for the rest of the logic
const {
    frequency, setFrequency,
    selectedDays, toggleDay,
    selectedWeeks, toggleWeek,
    timeSlots, addTimeSlot, removeTimeSlot,
    handleFinalize,
    startDate, setStartDate,
    endDate, setEndDate,
    dosageAmount, setDosageAmount,
    dosageUnit, setDosageUnit,
    selectedMed, setSelectedMed 
  } = usePatientMedications("123");

  // temperary library
const MEDICATIONS_LIBRARY = [
  { id: "1000000001", name: "Acamol (Paracetamol) 500mg", form: "TAB" },
  { id: "1000000002", name: "Optalgin (Dipyrone) 500mg", form: "TAB" },
  { id: "1000000003", name: "Advil (Ibuprofen) 200mg", form: "CAP" },
  { id: "1000000004", name: "Amoxicillin 500mg", form: "CAP" },
  { id: "1000000005", name: "Lipitor (Atorvastatin) 20mg", form: "TAB" }
];

const [searchQuery, setSearchQuery] = React.useState("");
const searchResults = MEDICATIONS_LIBRARY.filter(med => 
  med.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
);

  return (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogContent 
  className="!fixed !inset-0 !z-[100] !max-w-none !w-screen !h-screen !m-0 !p-0 !bg-background !border-none !translate-x-0 !translate-y-0 !rounded-none overflow-y-auto"
  style={{ transform: 'none !important' }} 
  dir="ltr"
>
  <div className="flex justify-center items-start w-full min-h-screen bg-background">
    <div className="w-full max-w-4xl py-12 px-6 flex flex-col gap-10">
    <DialogHeader className="text-center mb-10 flex flex-col items-center">
      <div className="bg-primary/10 p-4 rounded-3xl w-fit mb-4">
        <Pill className="text-primary rotate-45" size={32} />
      </div>
      <DialogTitle className="text-4xl font-extrabold text-foreground tracking-tight">
        {t("patientMeds.newPrescription")}
      </DialogTitle>
      <p className="text-muted-foreground text-lg mt-2">
        {t("patientMeds.configureSchedule")}
      </p>
      <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute -right-2 -top-2 rounded-full h-10 w-10 text-muted-foreground hover:bg-secondary">
                <X size={24} />
              </Button>
            </DialogClose>
    </DialogHeader>

      <div className="space-y-8 pb-20">          
          {/* Medication Selection */}
          <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card relative overflow-visible">
          <label className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
           <Pill size={14} />
            {t("patientMeds.medicationLabel")}
             </label>
               {selectedMed ? (
                <div className="bg-primary p-6 rounded-2xl flex items-center gap-5 justify-between animate-in fade-in duration-300">
                  <div className="flex items-center gap-5">
                   <div className="bg-primary/10 p-3 rounded-xl">
                      <Pill className="text-primary rotate-45"  size={28} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-foreground tracking-tight">{selectedMed.medName}</h4>
                      <p className="text-muted-foreground text-sm font-medium">ID: {selectedMed.id} • Form: {selectedMed.medForm}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedMed(null)}   
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full h-9 w-9">
                    <X size={20} />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={22} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("patientMeds.searchPlaceholder")}
                    className="pl-14 bg-secondary border-none h-16 rounded-2xl text-lg text-foreground focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
              )}
  {searchResults.length > 0 && !selectedMed && (
    <div className="absolute left-8 right-8 top-[calc(100%-10px)] z-[110] bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {searchResults.map((med) => (
  <button
    key={med.id}
    className="w-full text-left px-6 py-4 hover:bg-secondary transition-colors text-foreground border-b border-border last:border-none"
    onClick={() => {
      setSelectedMed({ id: med.id, medName: med.name, medForm: med.form });
      setSearchQuery("");
    }}
  >
    <p className="font-bold">{med.name}</p>
    <p className="text-xs text-muted-foreground font-medium">ID: {med.id}</p>
  </button>
))}
    </div>
  )}
      </Card>

          {/* Timeline & Dosage Grid */}
          <div className="grid grid-cols-2 gap-8">
            <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card space-y-5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
              <Clock size={14} />
              {t("patientMeds.timelineLabel")}
               </label>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.startDate")}</p>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="..." />
                <div>
                  <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.endDate")}</p>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="..." />                
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card space-y-5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
              <Pill size={14} />
               {t("patientMeds.dosageLabel")}
               </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.amount")}</p>
                  <Input type="number" value={dosageAmount} onChange={(e) => setDosageAmount(e.target.value)} 
                   className="bg-secondary border-none h-14 rounded-xl text-lg text-foreground" />
                   </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground mb-1">{t("patientMeds.unit")}</p>
                  <select value={dosageUnit} onChange={(e) => setDosageUnit(e.target.value)} 
                  className="w-full h-14 bg-secondary rounded-xl px-4 text-base border-none text-foreground focus:ring-2 focus:ring-primary/20 outline-none">                    <option value="ml">{t("patientMeds.units.ml")}</option>
                    <option value="mg">{t("patientMeds.units.mg")}</option>
                    <option value="tabs">{t("patientMeds.units.tabs")}</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Frequency & Schedule */}
            <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card space-y-5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-5 flex items-center gap-2">
              <Clock size={14} />
              {t("patientMeds.frequencyLabel")}
             </label>    
            <div className="flex bg-secondary p-1.5 rounded-2xl mb-8 w-full overflow-x-auto">
              {(['once', 'daily', 'weekly', 'monthly'] as FrequencyType[]).map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFrequency(f)} 
                  className={`flex-1 min-w-fit px-4 py-3 text-sm rounded-xl transition-all whitespace-nowrap ${
                        frequency === f 
                      ? 'bg-card shadow-md font-bold text-primary scale-[1.02]' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(`patientMeds.frequencyOptions.${f}`)}
                </button>
              ))}
            </div>

            {frequency === 'weekly' && (
              <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  {t("patientMeds.questions.whichDays")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <button 
                      key={day} 
                      onClick={() => toggleDay(day)}
                      className={`px-5 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                        selectedDays.includes(day) 
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                          : 'bg-card text-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      {t(`patientMeds.days.${day}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {frequency === 'monthly' && (
  <div className="space-y-6">
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("patientMeds.questions.whichWeeks")}</p>
      <div className="flex gap-2">
        {['1', '2', '3', '4'].map(week => (
          <button key={week} onClick={() => toggleWeek(week)} className={`flex-1 py-2 rounded-xl border ${selectedWeeks.includes(week) ? 'bg-primary text-primary-foreground'
      : 'bg-card text-card-foreground'}`}>
            {t(`patientMeds.weeks.${week}`)}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("patientMeds.questions.whichDays")}</p>
      <div className="flex flex-wrap gap-2">
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
          <button key={day} onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-xl border ${selectedDays.includes(day) ? 'bg-primary text-primary-foreground'
      : 'bg-card text-card-foreground'}`}>
            {t(`patientMeds.days.${day}`)}
          </button>
        ))}
      </div>
    </div>
  </div>
)}

            <div className="flex justify-between items-center mb-6 pt-5 border-t border-border">
                <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-2.5 tracking-wider">
                  <Clock size={16} className="text-muted-foreground" /> {t("patientMeds.timesPerDay")}
                </span>
                <Button variant="ghost" size="sm" onClick={addTimeSlot} className="text-primary font-bold hover:bg-primary/5 flex gap-1.5">
                  <Plus size={16} /> {t("patientMeds.addSlot")}
                </Button>
              </div>
            <div className="grid grid-cols-3 gap-4">
              {timeSlots.map((time, i) => (
                <div key={i} className="flex items-center gap-3 bg-secondary p-3 rounded-2xl border border-border group transition-all hover:border-primary/30">
                  <Input type="time" value={time} className="border-none bg-transparent shadow-none h-6 text-sm font-medium text-foreground focus-visible:ring-0" />
                  <Trash2 
                    size={16} 
                    className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors" 
                    onClick={() => removeTimeSlot(i)} 
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
               <div className="flex justify-center gap-5 pt-12 pb-20 border-t border-border mt-16 bg-background">
                  <Button
                onClick={handleFinalize}
                disabled={!selectedMed}
                className="min-w-[320px] h-16 bg-primary text-primary-foreground text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 transition-all active:scale-[0.98] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"              >
                <CheckCircle2 size={24} /> {t("patientMeds.finalize")}
              </Button>

              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="h-16 px-10 text-xl font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl"
                >
                  {t("patientMeds.cancel")}
                </Button>
              </DialogClose>
            </div>
        </div>
      </div>
    </div>
    </DialogContent>
  </Dialog>
);
}