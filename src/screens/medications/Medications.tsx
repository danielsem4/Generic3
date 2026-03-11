import React from "react";
import { useTranslation } from "react-i18next";
import { Pill, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMedications } from "./hooks/useMedications"; // Custom logic

/**
 * Medications Screen Component.
 * Implements the design using clean separation of concerns.
 */
export default function Medications() {
  const { t } = useTranslation();
  const { searchTerm, setSearchTerm, isSorted, toggleSort, filteredMedications, totalCount } = useMedications();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6" dir="rtl">
      
      {/* Top Controls: Sort button and Search input */}
      <div className="flex gap-4">
        
        {/* Sort Button with your specific style classes */}
        <button 
          onClick={toggleSort} 
          className={`bg-card px-4 py-2 rounded-md border border-border flex items-center gap-2 text-sm shadow-sm transition-colors ${
            isSorted ? "text-primary border-primary bg-accent" : "text-muted-foreground hover:bg-accent"
          }`}
        >
          <ArrowUpDown size={16} />
          {t("medications.sort")}
        </button>

        {/* Search Input Area */}
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("medications.searchPlaceholder")} 
            className="w-full pr-12 h-12 bg-card border-border shadow-sm focus:ring-primary focus-visible:ring-primary text-left ltr"/>
        </div>
      </div>

      {/* Header: Displays medication icon and dynamic total count */}
      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Pill className="text-primary rotate-45" size={24} />
        <span>{t("medications.allMedications")} ({totalCount})</span>
      </div>

      {/* Medications List: Mapping through the filtered data */}
      <div className="space-y-2">
        {filteredMedications.map((med, index) => (
         <Card key={med.id || index} className="bg-card hover:shadow-md transition-shadow cursor-pointer border-border">
         <CardContent className="p-4 flex justify-between items-center">
         <Pill size={16} className="text-muted-foreground rotate-45" />
         <span className="font-semibold text-right">
         {med.medName} ({med.medForm})
       </span>
    </CardContent>
  </Card>
))}

        {/* Empty State: Shown when no medications match the search */}
        {filteredMedications.length === 0 && (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            {t("medications.noData")}
          </div>
        )}
      </div>
    </div>
  );
}