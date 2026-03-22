import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Search, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePatientMedications } from "./hooks/usePatientMedications";
import { usePatientMedicationLogs } from "./hooks/usePatientMedicationLogs";
import { MedicationCard } from "./components/MedicationCard";
import { IntakeLogTable } from "./components/IntakeLogTable";
import { AddMedicationModal } from "./components/AddMedicationModal";
import { EditMedicationModal } from "./components/EditMedicationModal";
import type { IPatientPrescription } from "@/common/types/Medication";
import { useAuthStore } from "@/store/useAuthStore";

export default function PatientMedications() {
  const { t, i18n } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const role = useAuthStore((state) => state.role);
  const isDoctor = role === "DOCTOR";
  const {
    searchTerm,
    setSearchTerm,
    filteredPrescriptions,
    handleDelete,
    isAddModalOpen,
    setIsAddModalOpen,
  } = usePatientMedications(userId!);

  const { intakeLogs, filters, handleFilterChange, handleResetFilters, refetch } =
    usePatientMedicationLogs(userId!);

  const [editingPrescription, setEditingPrescription] = useState<IPatientPrescription | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleEditModalClose = (open: boolean) => {
    if (!open) setEditingPrescription(null);
  };

  return (
    <div
      className="p-4 space-y-6 bg-background min-h-screen text-left"
      dir={i18n.dir()}
    >
      {/* Search Bar Container */}
      <div className="flex justify-center max-w-4xl mx-auto">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 h-10 bg-card border-border rounded-lg text-sm"
            placeholder={t("patientMeds.searchPlaceholder")}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Title and Add Button */}
        <div className="flex justify-between items-center border-b border-border pb-2">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Pill className="text-primary rotate-45" size={20} />
            <span>{t("patientMeds.title")}</span>
          </div>
          {isDoctor && (
            <button
              onClick={openAddModal}
              className="text-primary text-sm font-semibold hover:underline cursor-pointer"
            >
              + {t("patientMeds.addMedication")}
            </button>
          )}
        </div>

        {/* List of Medications */}
        <div className="space-y-2">
          {filteredPrescriptions.map((pres) => (
            <MedicationCard
              key={pres.id}
              prescription={pres}
              onDelete={handleDelete}
              onEdit={setEditingPrescription}
              canManage={isDoctor}
            />
          ))}
        </div>

        {/* History Table */}
        <IntakeLogTable
          intakeLogs={intakeLogs}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onRefresh={refetch}
          prescriptions={filteredPrescriptions}
        />
      </div>

      {isDoctor && (
        <>
          <AddMedicationModal
            isOpen={isAddModalOpen}
            setIsOpen={setIsAddModalOpen}
            userId={userId!}
          />
          <EditMedicationModal
            prescription={editingPrescription}
            isOpen={!!editingPrescription}
            setIsOpen={handleEditModalClose}
            patientId={userId!}
          />
        </>
      )}
    </div>
  );
}
