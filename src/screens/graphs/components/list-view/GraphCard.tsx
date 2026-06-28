import { useTranslation } from "react-i18next";
import { LineChart, Pencil, Trash2 } from "lucide-react";
import type { IGraph } from "@/common/types/graph";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GraphCardProps {
  graph: IGraph;
  onEdit: (id: string) => void;
  onDelete: (graph: IGraph) => void;
}

export function GraphCard({ graph, onEdit, onDelete }: GraphCardProps) {
  const { t } = useTranslation();

  function handleEdit() {
    onEdit(graph.id);
  }

  function handleDelete() {
    onDelete(graph);
  }

  return (
    <Card className="rounded-2xl transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600">
            <LineChart size={22} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-bold text-foreground">{graph.name}</h3>
            <p className="truncate text-sm text-muted-foreground">
              {graph.description || t("graphs.noDescription")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("graphs.edit")}
            onClick={handleEdit}
          >
            <Pencil size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("graphs.delete")}
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
