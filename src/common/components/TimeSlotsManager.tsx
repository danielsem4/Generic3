import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ITimeSlotsManagerProps {
  timeSlots: string[];
  addTimeSlot: () => void;
  removeTimeSlot: (index: number) => void;
  updateTimeSlot: (index: number, value: string) => void;
  addButtonLabel: string;
  maxSlots?: number;
}

export const TimeSlotsManager = ({
  timeSlots,
  addTimeSlot,
  removeTimeSlot,
  updateTimeSlot,
  addButtonLabel,
  maxSlots,
}: ITimeSlotsManagerProps) => {
  const { t } = useTranslation();

  return (
    <>
      {(!maxSlots || timeSlots.length < maxSlots) && (
      <div className="flex justify-between items-center pt-5 border-t">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={addTimeSlot}
          className="text-primary font-bold"
        >
          + {t(addButtonLabel)}
        </Button>
      </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {timeSlots.map((time, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-secondary p-3 rounded-2xl border"
          >
            <input
              type="time"
              value={time}
              onChange={(e) => updateTimeSlot(i, e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm font-medium"
            />
            <Trash2
              size={16}
              className="text-muted-foreground cursor-pointer hover:text-destructive"
              onClick={() => removeTimeSlot(i)}
            />
          
          </div>
        ))}
      </div>
    </>
  );
};