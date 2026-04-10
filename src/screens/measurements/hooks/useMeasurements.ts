import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { IMeasurement } from "@/common/types/measurement";
import { MeasurementType, createDefaultScreen } from "@/common/types/measurement";

export interface IMeasurementGroup {
  type: MeasurementType;
  measurements: IMeasurement[];
}

const TYPE_ORDER: MeasurementType[] = [
  MeasurementType.QUESTIONNARIES,
  MeasurementType.COGNITIVE_TESTS,
  MeasurementType.MODULE_QUESTIONARIE,
];
import type { CreateMeasurementFormData } from "../Schema/measurementSchema";

export function useMeasurements() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const clinicId = useAuthStore((s) => s.clinicId);
  const firstName = useAuthStore((s) => s.firstName);

  const measurements = useMeasurementBuilderStore((s) => s.measurements);
  const addMeasurement = useMeasurementBuilderStore(
    (s) => s.addMeasurement,
  );
  const deleteMeasurement = useMeasurementBuilderStore(
    (s) => s.deleteMeasurement,
  );
  const duplicateMeasurement = useMeasurementBuilderStore(
    (s) => s.duplicateMeasurement,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IMeasurement | null>(null);

  const filteredMeasurements = measurements.filter(
    (q) =>
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedMeasurements: IMeasurementGroup[] = TYPE_ORDER
    .map((type) => ({
      type,
      measurements: filteredMeasurements.filter((m) => m.type === type),
    }))
    .filter((group) => group.measurements.length > 0);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleCreate(data: CreateMeasurementFormData) {
    const now = new Date().toISOString();
    const measurement: IMeasurement = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description ?? "",
      type: data.type,
      screens: [createDefaultScreen()],
      createdAt: now,
      updatedAt: now,
      createdBy: firstName ?? userId ?? "Unknown",
      clinicId: clinicId ?? "",
    };
    addMeasurement(measurement);
    setIsCreateOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteMeasurement(deleteTarget.id);
    setDeleteTarget(null);
  }

  function handleDuplicate(id: string) {
    duplicateMeasurement(id);
  }

  function handleEdit(id: string) {
    navigate(`/modules/measurements/builder/${id}`);
  }

  function handlePreview(id: string) {
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
    handlePreview,
  };
}
