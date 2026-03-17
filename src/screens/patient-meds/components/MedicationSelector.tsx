import React, { useState,type  ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Search, Pill, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IMedicationHookData } from "../schema/patientMedicationsSchema";

const MEDICATIONS_LIBRARY = [
  { id: "1000000001", name: "Acamol (Paracetamol) 500mg", form: "TAB" },
  { id: "1000000002", name: "Optalgin (Dipyrone) 500mg", form: "TAB" },
  { id: "1000000003", name: "Advil (Ibuprofen) 200mg", form: "CAP" },
  { id: "1000000004", name: "Amoxicillin 500mg", form: "CAP" },
  { id: "1000000005", name: "Lipitor (Atorvastatin) 20mg", form: "TAB" }
];

export const MedicationSelector = ({ hookData }: { hookData: IMedicationHookData }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  
  const results = MEDICATIONS_LIBRARY.filter(m => 
    m.name.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  return (
    <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card relative overflow-visible">
      <label className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
        <Pill size={14} /> {t("patientMeds.medicationLabel")}
      </label>

      {hookData.selectedMed ? (
        <div className="bg-primary/10 p-6 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 p-3 rounded-xl"><Pill className="text-primary rotate-45" size={28} /></div>
            <div>
              <h4 className="text-2xl font-extrabold text-foreground">{hookData.selectedMed.medName}</h4>
              <p className="text-sm text-muted-foreground font-medium">ID: {hookData.selectedMed.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => hookData.setSelectedMed(null)}><X size={20} /></Button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={22} />
          <Input 
            value={query} 
            onChange={handleSearchChange} 
            placeholder={t("patientMeds.searchPlaceholder")} 
            className="pl-14 bg-secondary border-none h-16 rounded-2xl text-lg" 
          />
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-[110] bg-card border shadow-2xl rounded-2xl mt-1 overflow-hidden">
              {results.map(m => (
                <button 
                  key={m.id} 
                  className="w-full text-left p-4 hover:bg-secondary border-b last:border-none font-medium" 
                  onClick={() => { hookData.setSelectedMed({ id: m.id, medName: m.name, medForm: m.form }); setQuery(""); }}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};