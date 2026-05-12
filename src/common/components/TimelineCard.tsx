import React, { type ChangeEvent } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ITimelineCardProps {
  label: string;
  startDateLabel: string;
  endDateLabel: string;
  startDate: string;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
}

export function TimelineCard({
  label,
  startDateLabel,
  endDateLabel,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ITimelineCardProps) {
  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) =>
    setStartDate(e.target.value);

  const handleEndChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEndDate(e.target.value);

  return (
    <Card className="p-8 border-none shadow-md rounded-[2rem] space-y-5">
      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
        <Clock size={14} />
        {label}
      </label>

      <div className="space-y-3">
        <p className="text-[11px] font-bold text-foreground mb-1">
          {startDateLabel}
        </p>
        <Input
          type="date"
          value={startDate}
          onChange={handleStartChange}
          className="bg-secondary border-none h-14 rounded-xl"
        />

        <p className="text-[11px] font-bold text-foreground mb-1">
          {endDateLabel}
        </p>
        <Input
          type="date"
          value={endDate}
          onChange={handleEndChange}
          className="bg-secondary border-none h-14 rounded-xl"
        />
      </div>
    </Card>
  );
}