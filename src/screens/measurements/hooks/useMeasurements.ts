import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import type { IMeasurement } from "@/common/types/measurement";
import { MeasurementType } from "@/common/types/measurement";
import type { CreateMeasurementFormData } from "../Schema/measurementSchema";
import { useCreateMeasurement } from "./useCreateMeasurement";
import { useDeleteMeasurement } from "./useDeleteMeasurement";
import { useUpdateMeasurement } from "./useUpdateMeasurement";
import { useMeasurementsQuery } from "./useMeasurementsQuery";

export interface IMeasurementGroup {
  type: MeasurementType;
  measurements: IMeasurement[];
}

const TYPE_ORDER: MeasurementType[] = [
  MeasurementType.QUESTIONNAIRES,
  MeasurementType.COGNITIVE_TESTS,
  MeasurementType.MODULE_QUESTIONNAIRE,
];

export function useMeasurements() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { data: measurements = [], isLoading } =
    useMeasurementsQuery(clinicId);

  const { createMeasurement, isSubmitting } = useCreateMeasurement();
  const { deleteMeasurement, isDeleting } = useDeleteMeasurement();
  const { updateMeasurement, isUpdating } = useUpdateMeasurement();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IMeasurement | null>(null);
  const [editTarget, setEditTarget] = useState<IMeasurement | null>(null);

  const filteredMeasurements = measurements.filter((q) =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedMeasurements: IMeasurementGroup[] = TYPE_ORDER
    .map((type) => ({
      type,
      measurements: filteredMeasurements.filter((m) => m.type === type),
    }))
;

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  async function handleCreate(data: CreateMeasurementFormData) {
    try {
      await createMeasurement(data);
      setIsCreateOpen(false);
      toast.success(t("measurements.createSuccess"));
    } catch {
      toast.error(t("measurements.createError"));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMeasurement(deleteTarget.id);
      toast.success(t("measurements.deleteSuccess"));
    } catch {
      toast.error(t("measurements.deleteError"));
    } finally {
      setDeleteTarget(null);
    }
  }

  function handleDuplicate(id: string) {
    navigate(`/modules/measurements/builder/${id}`);
  }

  function handleEdit(id: string) {
    navigate(`/modules/measurements/builder/${id}`);
  }

  function handleEditMetadata(measurement: IMeasurement) {
    setEditTarget(measurement);
  }

  function handleAdoptSuccess() {
    toast.success(t("measurements.adoptSuccess"));
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
      await updateMeasurement({
        measurementId: editTarget.id,
        data: {
          measurement_name: data.name,
          type: data.type,
          is_public: data.isPublic,
          is_active: data.isActive,
        },
      });
      toast.success(t("measurements.updateSuccess"));
      setEditTarget(null);
    } catch {
      toast.error(t("measurements.updateError"));
    }
  }

  return {
    measurements,
    groupedMeasurements,
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
