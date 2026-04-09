import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionnaireBuilderStore } from "@/store/useQuestionnaireBuilderStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { IQuestionnaire } from "@/common/types/questionnaire";
import { createDefaultScreen } from "@/common/types/questionnaire";
import type { CreateQuestionnaireFormData } from "../Schema/questionnaireSchema";

export function useQuestionnaires() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const clinicId = useAuthStore((s) => s.clinicId);
  const firstName = useAuthStore((s) => s.firstName);

  const questionnaires = useQuestionnaireBuilderStore((s) => s.questionnaires);
  const addQuestionnaire = useQuestionnaireBuilderStore(
    (s) => s.addQuestionnaire,
  );
  const deleteQuestionnaire = useQuestionnaireBuilderStore(
    (s) => s.deleteQuestionnaire,
  );
  const duplicateQuestionnaire = useQuestionnaireBuilderStore(
    (s) => s.duplicateQuestionnaire,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IQuestionnaire | null>(null);

  const filteredQuestionnaires = questionnaires.filter(
    (q) =>
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleCreate(data: CreateQuestionnaireFormData) {
    const now = new Date().toISOString();
    const questionnaire: IQuestionnaire = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description ?? "",
      screens: [createDefaultScreen()],
      createdAt: now,
      updatedAt: now,
      createdBy: firstName ?? userId ?? "Unknown",
      clinicId: clinicId ?? "",
    };
    addQuestionnaire(questionnaire);
    setIsCreateOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteQuestionnaire(deleteTarget.id);
    setDeleteTarget(null);
  }

  function handleDuplicate(id: string) {
    duplicateQuestionnaire(id);
  }

  function handleEdit(id: string) {
    navigate(`/modules/questionnaires/builder/${id}`);
  }

  function handlePreview(id: string) {
    navigate(`/modules/questionnaires/builder/${id}`);
  }

  return {
    questionnaires: filteredQuestionnaires,
    searchTerm,
    handleSearchChange,
    isCreateOpen,
    setIsCreateOpen,
    deleteTarget,
    setDeleteTarget,
    handleCreate,
    handleDelete,
    handleDuplicate,
    handleEdit,
    handlePreview,
  };
}
