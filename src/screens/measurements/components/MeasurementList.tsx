import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { IMeasurement } from "@/common/types/measurement";
import type { IMeasurementGroup } from "../hooks/useMeasurements";
import { MeasurementTypeColumn } from "./MeasurementTypeColumn";

interface MeasurementListProps {
  groups: IMeasurementGroup[];
  onEdit: (id: string) => void;
  onEditMetadata: (m: IMeasurement) => void;
  onDelete: (q: IMeasurement) => void;
  onDuplicate: (id: string) => void;
  readOnly?: boolean;
}

export function MeasurementList({
  groups,
  onEdit,
  onEditMetadata,
  onDelete,
  onDuplicate,
  readOnly,
}: MeasurementListProps) {
  const { t } = useTranslation();

  if (groups.every((g) => g.measurements.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
        <FileText size={48} strokeWidth={1.5} />
        <p className="text-lg">{t("measurements.noData")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <MeasurementTypeColumn
          key={group.type}
          type={group.type}
          measurements={group.measurements}
          onEdit={onEdit}
          onEditMetadata={onEditMetadata}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
