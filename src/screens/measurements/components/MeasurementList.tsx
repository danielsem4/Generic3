import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { IMeasurement } from "@/common/types/measurement";
import { MeasurementCard } from "./MeasurementCard";

interface MeasurementListProps {
  measurements: IMeasurement[];
  onEdit: (id: string) => void;
  onDelete: (q: IMeasurement) => void;
  onDuplicate: (id: string) => void;
  onPreview: (id: string) => void;
}

export function MeasurementList({
  measurements,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: MeasurementListProps) {
  const { t } = useTranslation();

  if (measurements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
        <FileText size={48} strokeWidth={1.5} />
        <p className="text-lg">{t("measurements.noData")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {measurements.map((q) => (
        <MeasurementCard
          key={q.id}
          measurement={q}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
