import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IGraph } from "@/common/types/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGraphChartData } from "../hooks/useGraphChartData";
import { GraphChart } from "./GraphChart";
import { GraphExplanation } from "./GraphExplanation";

interface GraphDetailProps {
  graph: IGraph;
  patientId: string | undefined;
  clinicId: string | null;
}

export function GraphDetail({ graph, patientId, clinicId }: GraphDetailProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const { isLoading, points, overlaySeries, xLabel, yLabel, legend } =
    useGraphChartData(graph.id, patientId, clinicId, date);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDate(e.target.value);

  const hasOverlayData = overlaySeries.some(
    (s) =>
      s.points.length > 0 ||
      s.markersByCategory.some((c) => c.points.length > 0),
  );
  const hasData = points.length > 0 || hasOverlayData;

  return (
    <Card className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-base font-semibold">{graph.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor="graph-date" className="text-sm text-muted-foreground">
            {t("graphs.dateFilter")}
          </Label>
          <Input
            id="graph-date"
            type="date"
            value={date}
            onChange={handleDateChange}
            className="h-9 w-auto"
          />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        {isLoading ? (
          <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            {t("graphs.loading")}
          </p>
        ) : !hasData ? (
          <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            {t("graphs.noData")}
          </p>
        ) : (
          <>
            <div className="min-h-0 flex-1">
              <GraphChart
                points={points}
                overlaySeries={overlaySeries}
                yLabel={yLabel ?? graph.name}
              />
            </div>
            <GraphExplanation
              description={graph.description}
              xLabel={xLabel}
              yLabel={yLabel}
              legend={legend}
              overlaySeries={overlaySeries}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
