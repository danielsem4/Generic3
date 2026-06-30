import { useTranslation } from "react-i18next";
import { Activity } from "lucide-react";
import type {
  IParkinsonSensorEvent,
  TParkinsonSensorEventType,
} from "@/common/types/parkinsonSensor";

interface SensorEventsTableProps {
  events: IParkinsonSensorEvent[];
}

const EVENT_NAME_KEY: Record<TParkinsonSensorEventType, string> = {
  tremor: "parkinsonSensors.detectors.tremor.name",
  fall: "parkinsonSensors.detectors.fall.name",
  near_fall: "parkinsonSensors.detectors.nearFall.name",
  on_off: "parkinsonSensors.detectors.onOff.name",
};

export const SensorEventsTable = ({ events }: SensorEventsTableProps) => {
  const { t } = useTranslation();

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border bg-muted/30 py-16 text-sm text-muted-foreground">
        {t("parkinsonSensors.patientView.empty")}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("parkinsonSensors.patientView.table.event")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("parkinsonSensors.patientView.table.detectedAt")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("parkinsonSensors.patientView.table.sensors")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("parkinsonSensors.patientView.table.details")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border/50">
          {events.map((event, index) => (
            <tr key={event.id || index} className="hover:bg-accent/30">
              <td className="py-6 px-4 font-semibold text-[14px]">
                <span className="inline-flex items-center gap-2">
                  <Activity className="w-4 h-4 text-chart-2" />
                  {t(EVENT_NAME_KEY[event.eventType])}
                </span>
              </td>

              <td className="py-6 px-4 text-muted-foreground text-[14px]">
                {event.detectedAt !== "-"
                  ? new Date(event.detectedAt).toLocaleString()
                  : "-"}
              </td>

              <td className="py-6 px-4 text-muted-foreground text-[14px]">
                {event.sensors}
              </td>

              <td className="py-6 px-4 text-muted-foreground text-[14px]">
                {event.details}
                {event.confidence !== undefined && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-primary/10 text-primary border border-primary/20">
                    {Math.round(event.confidence * 100)}%
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
