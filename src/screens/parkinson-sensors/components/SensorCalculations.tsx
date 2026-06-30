import { useTranslation } from "react-i18next";
import { Activity, ListChecks, Waves, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PIPELINE_STEPS = ["metrics", "baseline", "classify"] as const;
const DETECTORS = ["tremor", "fall", "nearFall", "onOff"] as const;

export default function SensorCalculations() {
  const { t } = useTranslation();

  const classifyPoints = t("parkinsonSensors.calc.classifyPoints", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary shadow-sm">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            {t("parkinsonSensors.calc.heading")}
          </h2>
        </div>
        <p className="text-muted-foreground text-base font-medium leading-relaxed">
          {t("parkinsonSensors.calc.intro")}
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {PIPELINE_STEPS.map((step) => (
            <div
              key={step}
              className="rounded-xl border border-border bg-background p-4 flex flex-col gap-1.5"
            >
              <h3 className="font-bold text-foreground text-sm">
                {t(`parkinsonSensors.calc.${step}Title`)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`parkinsonSensors.calc.${step}Body`)}
              </p>
            </div>
          ))}
        </div>

        <ul className="flex flex-col gap-2">
          {classifyPoints.map((point, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
            >
              <ListChecks
                size={16}
                strokeWidth={2.5}
                className="mt-0.5 shrink-0 text-primary"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary shadow-sm">
            <Waves size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            {t("parkinsonSensors.detectors.heading")}
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("parkinsonSensors.detectors.colEvent")}</TableHead>
              <TableHead>{t("parkinsonSensors.detectors.colSensors")}</TableHead>
              <TableHead>{t("parkinsonSensors.detectors.colMethod")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DETECTORS.map((detector) => (
              <TableRow key={detector}>
                <TableCell className="font-bold text-foreground whitespace-normal">
                  {t(`parkinsonSensors.detectors.${detector}.name`)}
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-normal">
                  {t(`parkinsonSensors.detectors.${detector}.sensors`)}
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-normal">
                  {t(`parkinsonSensors.detectors.${detector}.method`)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary shadow-sm">
            <Upload size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            {t("parkinsonSensors.upload.heading")}
          </h2>
        </div>
        <p className="text-muted-foreground text-base font-medium leading-relaxed">
          {t("parkinsonSensors.upload.body")}
        </p>
      </section>
    </div>
  );
}
