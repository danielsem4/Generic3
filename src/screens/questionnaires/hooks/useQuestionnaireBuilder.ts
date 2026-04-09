import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestionnaireBuilderStore } from "@/store/useQuestionnaireBuilderStore";

export function useQuestionnaireBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const loadQuestionnaire = useQuestionnaireBuilderStore(
    (s) => s.loadQuestionnaire,
  );
  const saveCurrentQuestionnaire = useQuestionnaireBuilderStore(
    (s) => s.saveCurrentQuestionnaire,
  );
  const clearCanvas = useQuestionnaireBuilderStore((s) => s.clearCanvas);
  const isPreviewMode = useQuestionnaireBuilderStore((s) => s.isPreviewMode);
  const setPreviewMode = useQuestionnaireBuilderStore((s) => s.setPreviewMode);
  const activeQuestionnaireId = useQuestionnaireBuilderStore(
    (s) => s.activeQuestionnaireId,
  );
  const questionnaires = useQuestionnaireBuilderStore((s) => s.questionnaires);
  const isDirty = useQuestionnaireBuilderStore((s) => s.isDirty);

  const activeQuestionnaire = questionnaires.find(
    (q) => q.id === activeQuestionnaireId,
  );

  useEffect(() => {
    if (id) {
      loadQuestionnaire(id);
    }
  }, [id, loadQuestionnaire]);

  function handleSave() {
    saveCurrentQuestionnaire();
    navigate("/modules/questionnaires");
  }

  function handleBack() {
    navigate("/modules/questionnaires");
  }

  function handleClearCanvas() {
    clearCanvas();
  }

  function handleTogglePreview() {
    setPreviewMode(!isPreviewMode);
  }

  return {
    activeQuestionnaire,
    isPreviewMode,
    isDirty,
    handleSave,
    handleBack,
    handleClearCanvas,
    handleTogglePreview,
  };
}
