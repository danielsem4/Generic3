import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import type { IMeasurement } from "@/common/types/measurement";
import { MeasurementType } from "@/common/types/measurement";
import type { CreateMeasurementFormData } from "../Schema/measurementSchema";
import { useCreateMeasurement } from "./useCreateMeasurement";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IMeasurement | null>(null);

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
      throw new Error("create failed");
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setDeleteTarget(null);
  }

  function handleDuplicate(id: string) {
    navigate(`/modules/measurements/builder/${id}`);
  }

  function handleEdit(id: string) {
    navigate(`/modules/measurements/builder/${id}`);
  }

  return {
    groupedMeasurements,
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
    isSubmitting,
    isLoading,
  };
}
