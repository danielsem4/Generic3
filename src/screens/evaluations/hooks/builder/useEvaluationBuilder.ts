import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useEvaluationBuilderStore } from "@/store/useEvaluationBuilderStore";
import { useEvaluationsQuery } from "../queries/useEvaluationsQuery";
import { useEvaluationStructureQuery } from "../queries/useEvaluationStructureQuery";
import { useSaveEvaluationStructure } from "../queries/useSaveEvaluationStructure";
import {
  transformPayloadToScreens,
  transformScreensToPayload,
} from "../../lib/transformStructure";

export function useEvaluationBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { data: fetchedEvaluations } = useEvaluationsQuery(clinicId);
  const {
    data: structureData,
    isLoading: isLoadingStructureQuery,
  } = useEvaluationStructureQuery(id);

  const hydrateScreens = useEvaluationBuilderStore((s) => s.hydrateScreens);
  const saveCurrentEvaluation = useEvaluationBuilderStore(
    (s) => s.saveCurrentEvaluation,
  );
  const clearCanvas = useEvaluationBuilderStore((s) => s.clearCanvas);
  const isPreviewMode = useEvaluationBuilderStore((s) => s.isPreviewMode);
  const setPreviewMode = useEvaluationBuilderStore((s) => s.setPreviewMode);
  const activeEvaluationId = useEvaluationBuilderStore(
    (s) => s.activeEvaluationId,
  );
  const evaluations = useEvaluationBuilderStore((s) => s.evaluations);
  const screens = useEvaluationBuilderStore((s) => s.screens);
  const isDirty = useEvaluationBuilderStore((s) => s.isDirty);

  const { saveStructure, isSaving } = useSaveEvaluationStructure();

  const activeEvaluation = evaluations.find(
    (q) => q.id === activeEvaluationId,
  );

  useEffect(() => {
    if (!id || !fetchedEvaluations) return;

    const store = useEvaluationBuilderStore.getState();
    if (store.activeEvaluationId === id) return;

    const evaluation = fetchedEvaluations.find((m) => m.id === id);
    if (!evaluation) return;

    if (!store.evaluations.some((m) => m.id === id)) {
      store.addEvaluation(evaluation);
    }
    store.loadEvaluation(id);
  }, [id, fetchedEvaluations]);

  useEffect(() => {
    if (!id || !structureData) return;

    const store = useEvaluationBuilderStore.getState();
    if (store.activeEvaluationId !== id) return;
    if (store.isDirty) return;

    const serverScreens = transformPayloadToScreens(structureData);
    hydrateScreens(serverScreens);
  }, [id, structureData, hydrateScreens]);

  const isLoadingStructure = !!id && isLoadingStructureQuery;

  async function handleSave() {
    if (!activeEvaluationId) return;

    try {
      const payload = transformScreensToPayload(screens);
      await saveStructure({ evaluationId: activeEvaluationId, payload });
      saveCurrentEvaluation();
      toast.success(t("evaluations.builder.saveSuccess"));
    } catch {
      toast.error(t("evaluations.builder.saveError"));
    }
  }

  function handleBack() {
    navigate("/modules/evaluations");
  }

  function handleClearCanvas() {
    clearCanvas();
  }

  function handleTogglePreview() {
    setPreviewMode(!isPreviewMode);
  }

  return {
    activeEvaluation,
    isPreviewMode,
    isDirty,
    isSaving,
    isLoadingStructure,
    handleSave,
    handleBack,
    handleClearCanvas,
    handleTogglePreview,
  };
}
