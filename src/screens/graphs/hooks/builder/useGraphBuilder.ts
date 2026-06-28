import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import type { IAxisConfig, IGraphOverlay } from "@/common/types/graph";
import { useEvaluationsQuery } from "@/screens/evaluations/hooks/queries/useEvaluationsQuery";
import {
  graphConfigSchema,
  type GraphConfigFormData,
} from "../../schema/graphSchema";
import { useCreateGraph } from "../queries/useCreateGraph";
import { useUpdateGraph } from "../queries/useUpdateGraph";
import { useSaveGraphStructure } from "../queries/useSaveGraphStructure";
import { useGraphsQuery } from "../queries/useGraphsQuery";
import { useGraphStructureQuery } from "../queries/useGraphStructureQuery";
import { useGraphElements } from "./useGraphElements";

const DEFAULT_FORM: GraphConfigFormData = {
  name: "",
  description: "",
  evaluationId: "",
  xAxis: { source: "SUBMISSION_DATE" },
  yAxis: { source: "SUBMISSION_SCORE" },
  overlays: [],
};

type AxisKey = "xAxis" | "yAxis";

export function useGraphBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);
  const isEdit = !!id;

  const { data: graphs = [] } = useGraphsQuery(clinicId);
  const { data: evaluations = [] } = useEvaluationsQuery(clinicId);
  const { data: structure } = useGraphStructureQuery(id);
  const { createGraph, isSubmitting } = useCreateGraph();
  const { updateGraph, isUpdating } = useUpdateGraph();
  const { saveGraphStructure, isSavingStructure } = useSaveGraphStructure();

  const [form, setForm] = useState<GraphConfigFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydratedId, setHydratedId] = useState<string | null>(null);

  const existing = id ? graphs.find((g) => g.id === id) : undefined;
  const { elements } = useGraphElements(form.evaluationId);

  // Prefill once both the graph meta and its structure have loaded.
  if (isEdit && existing && structure && hydratedId !== existing.id) {
    setHydratedId(existing.id);
    setForm({
      name: existing.name,
      description: existing.description ?? "",
      evaluationId: structure.evaluationId,
      xAxis: structure.xAxis,
      yAxis: structure.yAxis,
      overlays: structure.overlays ?? [],
    });
  }

  function setName(name: string) {
    setForm((f) => ({ ...f, name }));
  }

  function setDescription(description: string) {
    setForm((f) => ({ ...f, description }));
  }

  function setEvaluationId(evaluationId: string) {
    // Element selections are evaluation-specific; reset them on change.
    setForm((f) => ({
      ...f,
      evaluationId,
      xAxis: { ...f.xAxis, elementId: undefined },
      yAxis: { ...f.yAxis, elementId: undefined },
    }));
  }

  function updateAxis(key: AxisKey, patch: Partial<IAxisConfig>) {
    setForm((f) => ({ ...f, [key]: { ...f[key], ...patch } }));
  }

  function addOverlay() {
    const overlay: IGraphOverlay = {
      id: crypto.randomUUID(),
      type: "QUESTION",
      render: "MARKERS",
    };
    setForm((f) => ({ ...f, overlays: [...f.overlays, overlay] }));
  }

  function updateOverlay(overlayId: string, patch: Partial<IGraphOverlay>) {
    setForm((f) => ({
      ...f,
      overlays: f.overlays.map((o) =>
        o.id === overlayId ? { ...o, ...patch } : o,
      ),
    }));
  }

  function removeOverlay(overlayId: string) {
    setForm((f) => ({
      ...f,
      overlays: f.overlays.filter((o) => o.id !== overlayId),
    }));
  }

  async function handleSave() {
    const result = graphConfigSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const { name, description, evaluationId, xAxis, yAxis, overlays } =
      result.data;
    const meta = { name, description };
    const graphStructure = { evaluationId, xAxis, yAxis, overlays };
    try {
      let graphId: string;
      if (isEdit && id) {
        await updateGraph({ graphId: id, data: meta });
        graphId = id;
      } else {
        graphId = (await createGraph(meta)).id;
      }
      await saveGraphStructure({ graphId, structure: graphStructure });
      toast.success(isEdit ? t("graphs.updateSuccess") : t("graphs.createSuccess"));
      navigate("/modules/graphs");
    } catch {
      toast.error(isEdit ? t("graphs.updateError") : t("graphs.createError"));
    }
  }

  function handleBack() {
    navigate("/modules/graphs");
  }

  return {
    form,
    errors,
    elements,
    evaluations,
    isEdit,
    isSaving: isSubmitting || isUpdating || isSavingStructure,
    setName,
    setDescription,
    setEvaluationId,
    updateAxis,
    addOverlay,
    updateOverlay,
    removeOverlay,
    handleSave,
    handleBack,
  };
}
