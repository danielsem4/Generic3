import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { IMeasurement } from "@/common/types/measurement";
import { MeasurementType } from "@/common/types/measurement";
import type { IMeasurementGroup } from "../hooks/useMeasurements";
import { MeasurementCard } from "./MeasurementCard";
import { Badge } from "@/components/ui/badge";

const TYPE_I18N_KEY: Record<MeasurementType, string> = {
  [MeasurementType.QUESTIONNARIES]: "measurements.types.questionnaries",
  [MeasurementType.COGNITIVE_TESTS]: "measurements.types.cognitiveTests",
  [MeasurementType.MODULE_QUESTIONARIE]: "measurements.types.moduleQuestionnaire",
};

interface MeasurementListProps {
  groups: IMeasurementGroup[];
  onEdit: (id: string) => void;
  onDelete: (q: IMeasurement) => void;
  onDuplicate: (id: string) => void;
  onPreview: (id: string) => void;
}

export function MeasurementList({
  groups,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: MeasurementListProps) {
  const { t } = useTranslation();

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
        <FileText size={48} strokeWidth={1.5} />
        <p className="text-lg">{t("measurements.noData")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.type}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-muted-foreground">
              {t(TYPE_I18N_KEY[group.type])}
            </h2>
            <Badge variant="secondary">{group.measurements.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.measurements.map((q) => (
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
        </section>
      ))}
    </div>
  );
}
