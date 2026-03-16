import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IMedicationHookData } from "../schema/patientMedicationsSchema";

export const FrequencyManager = ({ hookData }: { hookData: IMedicationHookData }) => {
  const { t } = useTranslation();
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card space-y-5">
      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
        <Clock size={14} /> {t("patientMeds.frequencyLabel")}
      </label>
      
      {/* Selector Tabs */}
      <div className="flex bg-secondary p-1.5 rounded-2xl mb-8">
        {(['once', 'daily', 'weekly', 'monthly'] as const).map((f) => (
          <button key={f} onClick={() => hookData.setFrequency(f)} className={`flex-1 py-3 text-sm rounded-xl transition-all ${hookData.frequency === f ? 'bg-card shadow-md font-bold text-primary' : 'text-muted-foreground'}`}>
            {t(`patientMeds.frequencyOptions.${f}`)}
          </button>
        ))}
      </div>

      {/* Weekly/Monthly Questions */}
      {(hookData.frequency === 'weekly' || hookData.frequency === 'monthly') && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
          {hookData.frequency === 'monthly' && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("patientMeds.questions.whichWeeks")}</p>
              <div className="flex gap-2">
                {['1', '2', '3', '4'].map(w => (
                  <button key={w} onClick={() => hookData.toggleWeek(w)} className={`flex-1 py-2 rounded-xl border ${hookData.selectedWeeks.includes(w) ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    {t(`patientMeds.weeks.${w}`)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("patientMeds.questions.whichDays")}</p>
            <div className="flex flex-wrap gap-2">
              {days.map(d => (
                <button key={d} onClick={() => hookData.toggleDay(d)} className={`px-4 py-2 rounded-xl border ${hookData.selectedDays.includes(d) ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                  {t(`patientMeds.days.${d}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Time Slots */}
      <div className="flex justify-between items-center pt-5 border-t">
        <Button variant="ghost" size="sm" onClick={hookData.addTimeSlot} className="text-primary font-bold">+ {t("patientMeds.addSlot")}</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {hookData.timeSlots.map((time, i) => (
          <div key={i} className="flex items-center gap-3 bg-secondary p-3 rounded-2xl border">
            <input type="time" value={time} className="bg-transparent outline-none flex-1 text-sm font-medium" readOnly />
            <Trash2 size={16} className="text-muted-foreground cursor-pointer hover:text-destructive" onClick={() => hookData.removeTimeSlot(i)} />
          </div>
        ))}
      </div>
    </Card>
  );
};