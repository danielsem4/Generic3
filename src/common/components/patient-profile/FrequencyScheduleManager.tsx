import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TimeSlotsManager } from "@/common/components/TimeSlotsManager";

type FrequencyType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

interface IFrequencyScheduleManagerProps {
  hookData: {
    frequency: FrequencyType;
    setFrequency: (value: FrequencyType) => void;
    selectedDays: string[];
    toggleDay: (day: string) => void;
    timeSlots: string[];
    addTimeSlot: () => void;
    removeTimeSlot: (index: number) => void;
    updateTimeSlot: (index: number, value: string) => void;
    dayOfMonth: string;
    setDayOfMonth: (value: string) => void;
  };
  translationKey: string;
  maxSlotsByFrequency?: boolean;
}

export const FrequencyScheduleManager = ({
  hookData,
  translationKey,
  maxSlotsByFrequency = true,
}: IFrequencyScheduleManagerProps) => {
  const { t } = useTranslation();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card space-y-5">
      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
        <Clock size={14} /> {t(`${translationKey}.frequencyLabel`)}
      </label>

      <div className="flex bg-secondary p-1.5 rounded-2xl mb-8">
        {(["once", "daily", "weekly", "monthly"] as const).map((f) => {
          const value = f.toUpperCase() as FrequencyType;

          return (
            <button
              key={f}
              type="button"
              onClick={() => hookData.setFrequency(value)}
              className={`flex-1 py-3 text-sm rounded-xl transition-all ${
                hookData.frequency === value
                  ? "bg-card shadow-md font-bold text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {t(`${translationKey}.frequencyOptions.${f}`)}
            </button>
          );
        })}
      </div>

      {hookData.frequency === "WEEKLY" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              {t(`${translationKey}.daysOfWeek`)}
            </p>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => hookData.toggleDay(day)}
                  className={`px-4 py-2 rounded-xl border ${
                    hookData.selectedDays.includes(day)
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  {t(`${translationKey}.days.${day}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {hookData.frequency === "MONTHLY" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              {t(`${translationKey}.dayOfMonth`)}
            </p>
            <input
              type="number"
              min="1"
              max="31"
              value={hookData.dayOfMonth}
              onChange={(e) => hookData.setDayOfMonth(e.target.value)}
              className="w-full h-12 bg-secondary rounded-xl px-4 outline-none border-none text-sm font-medium"
            />
          </div>
        </div>
      )}

      <TimeSlotsManager
        timeSlots={hookData.timeSlots}
        addTimeSlot={hookData.addTimeSlot}
        removeTimeSlot={hookData.removeTimeSlot}
        updateTimeSlot={hookData.updateTimeSlot}
        addButtonLabel={`${translationKey}.addTime`}
        maxSlots={
          maxSlotsByFrequency &&
          (hookData.frequency === "WEEKLY" || hookData.frequency === "MONTHLY")
            ? 1
            : undefined
        }
      />
    </Card>
  );
};