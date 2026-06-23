import { useTranslation } from "react-i18next";
import type { IGraph } from "@/common/types/graph";
import { GraphCard } from "./GraphCard";

interface GraphListProps {
  graphs: IGraph[];
  onEdit: (id: string) => void;
  onDelete: (graph: IGraph) => void;
}

export function GraphList({ graphs, onEdit, onDelete }: GraphListProps) {
  const { t } = useTranslation();

  if (graphs.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        {t("graphs.empty")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {graphs.map((graph) => (
        <GraphCard
          key={graph.id}
          graph={graph}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
