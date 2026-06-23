import { useTranslation } from "react-i18next";
import type { IGraph } from "@/common/types/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { isLoading, points, xLabel, yLabel, legend } = useGraphChartData(
    graph.id,
    patientId,
    clinicId,
  );

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{graph.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("graphs.loading")}</p>
        ) : points.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("graphs.noData")}</p>
        ) : (
          <>
            <GraphChart points={points} yLabel={yLabel ?? graph.name} />
            <GraphExplanation
              description={graph.description}
              xLabel={xLabel}
              yLabel={yLabel}
              legend={legend}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
