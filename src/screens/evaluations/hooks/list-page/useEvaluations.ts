import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import type { IEvaluation } from "@/common/types/evaluation";
import { EvaluationType } from "@/common/types/evaluation";
import type { CreateEvaluationFormData } from "../../schema/evaluationSchema";
import { useCreateEvaluation } from "../queries/useCreateEvaluation";
import { useDeleteEvaluation } from "../queries/useDeleteEvaluation";
import { useUpdateEvaluation } from "../queries/useUpdateEvaluation";
import { useEvaluationsQuery } from "../queries/useEvaluationsQuery";

export interface IEvaluationGroup {
  type: EvaluationType;
  evaluations: IEvaluation[];
}

const TYPE_ORDER: EvaluationType[] = [
  EvaluationType.QUESTIONNAIRES,
  EvaluationType.COGNITIVE_TESTS,
  EvaluationType.MODULE_QUESTIONNAIRE,
];

export function useEvaluations() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { data: evaluations = [], isLoading } =
    useEvaluationsQuery(clinicId);

  const { createEvaluation, isSubmitting } = useCreateEvaluation();
  const { deleteEvaluation, isDeleting } = useDeleteEvaluation();
  const { updateEvaluation, isUpdating } = useUpdateEvaluation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IEvaluation | null>(null);
  const [editTarget, setEditTarget] = useState<IEvaluation | null>(null);

  const filteredEvaluations = evaluations.filter((q) =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedEvaluations: IEvaluationGroup[] = TYPE_ORDER
    .map((type) => ({
      type,
      evaluations: filteredEvaluations.filter((m) => m.type === type),
    }))
;

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  async function handleCreate(data: CreateEvaluationFormData) {
    try {
      await createEvaluation(data);
      setIsCreateOpen(false);
      toast.success(t("evaluations.createSuccess"));
    } catch {
      toast.error(t("evaluations.createError"));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteEvaluation(deleteTarget.id);
      toast.success(t("evaluations.deleteSuccess"));
    } catch {
      toast.error(t("evaluations.deleteError"));
    } finally {
      setDeleteTarget(null);
    }
  }

  function handleDuplicate(id: string) {
    navigate(`/modules/evaluations/builder/${id}`);
  }

  function handleEdit(id: string) {
    navigate(`/modules/evaluations/builder/${id}`);
  }

  function handleEditMetadata(evaluation: IEvaluation) {
    setEditTarget(evaluation);
  }

  function handleAdoptSuccess() {
    toast.success(t("evaluations.adoptSuccess"));
    setIsAddExistingOpen(false);
  }

  async function handleUpdate(data: {
    name: string;
    type: string;
    isPublic: boolean;
    isActive: boolean;
  }) {
    if (!editTarget) return;
    try {
      await updateEvaluation({
        evaluationId: editTarget.id,
        data: {
          evaluation_name: data.name,
          type: data.type,
          is_public: data.isPublic,
          is_active: data.isActive,
        },
      });
      toast.success(t("evaluations.updateSuccess"));
      setEditTarget(null);
    } catch {
      toast.error(t("evaluations.updateError"));
    }
  }

  return {
    evaluations,
    groupedEvaluations,
    searchTerm,
    handleSearchChange,
    isCreateOpen,
    setIsCreateOpen,
    isAddExistingOpen,
    setIsAddExistingOpen,
    handleAdoptSuccess,
    deleteTarget,
    setDeleteTarget,
    editTarget,
    setEditTarget,
    handleCreate,
    handleDelete,
    handleDuplicate,
    handleEdit,
    handleEditMetadata,
    handleUpdate,
    isSubmitting,
    isDeleting,
    isUpdating,
    isLoading,
  };
}
