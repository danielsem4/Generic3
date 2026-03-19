import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {Activity,Pill,BarChart3,Pencil,} from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionItem from "./SectionItem";
import type { IPatientSectionItem } from "@/common/types/patientDetails";

interface Props {
  readonly functions?: IPatientSectionItem[];
  readonly metrics?: IPatientSectionItem[];
  readonly modules?: IPatientSectionItem[];
}

function Section({
  title,
  icon: Icon,
  iconClassName,
  items = [],
  editLabel,
  enableLabel,
  emptyLabel,
}: {
  readonly title: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly iconClassName: string;
  readonly items?: IPatientSectionItem[];
  readonly editLabel: string;
  readonly enableLabel: string;
  readonly emptyLabel: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconClassName}`} />
          <CardTitle className="text-base font-bold">{title}</CardTitle>
        </div>

        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Pencil className="h-3 w-3" />
          {editLabel}
        </button>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center rounded-md border bg-muted/30 py-6 text-sm text-muted-foreground">
            {emptyLabel}
          </div>
        ) : (
          items.map((item) => (
             <SectionItem
                key={item.id}
                item={item}
                icon={Icon}
                iconClassName={iconClassName}
                enableLabel={enableLabel}
              />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function PatientSectionsCard({
  functions = [],
  metrics = [],
  modules = [],
}: Props) {

  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

      <Section
        title={t("patient.modules")}
        icon={Pill}
        iconClassName="text-chart-1"
        items={modules}
        editLabel={t("patient.editDetails")}
        enableLabel={t("patient.enable")}
        emptyLabel={t("patient.noData")}
      />

      <Section
        title={t("patient.metrics")}
        icon={Activity}
        iconClassName="text-chart-2"
        items={metrics}
        editLabel={t("patient.editDetails")}
        enableLabel={t("patient.enable")}
        emptyLabel={t("patient.noData")}
      />

      <Section
        title={t("patient.customFunctions")}
        icon={BarChart3}
        iconClassName="text-chart-5"
        items={functions}
        editLabel={t("patient.editDetails")}
        enableLabel={t("patient.enable")}
        emptyLabel={t("patient.noData")}
      />

    </div>
  );
}