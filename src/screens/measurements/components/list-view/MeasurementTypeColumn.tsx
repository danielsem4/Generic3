import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MeasurementType } from "@/common/types/measurement";
import type { IMeasurement } from "@/common/types/measurement";
import { MeasurementRow } from "./MeasurementRow";

const TYPE_I18N_KEY: Record<MeasurementType, string> = {
  [MeasurementType.QUESTIONNAIRES]: "measurements.types.questionnaries",
  [MeasurementType.COGNITIVE_TESTS]: "measurements.types.cognitiveTests",
  [MeasurementType.MODULE_QUESTIONNAIRE]: "measurements.types.moduleQuestionnaire",
};

interface MeasurementTypeColumnProps {
  type: MeasurementType;
  measurements: IMeasurement[];
  onEdit: (id: string) => void;
  onEditMetadata: (m: IMeasurement) => void;
  onDelete: (q: IMeasurement) => void;
  onDuplicate: (id: string) => void;
  readOnly?: boolean;
}

export function MeasurementTypeColumn({
  type,
  measurements,
  onEdit,
  onEditMetadata,
  onDelete,
  onDuplicate,
  readOnly,
}: MeasurementTypeColumnProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t(TYPE_I18N_KEY[type])}</CardTitle>
          <Badge variant="secondary">{measurements.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="max-h-[60vh] overflow-y-auto pt-0">
        {measurements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {t("measurements.emptyColumn")}
          </p>
        ) : (
          <div className="space-y-2">
            {measurements.map((m) => (
              <MeasurementRow
                key={m.id}
                measurement={m}
                onEdit={onEdit}
                onEditMetadata={onEditMetadata}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
