import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Search, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePatientActivities } from "./hooks/usePatientActivities";
import { usePatientActivityLogs } from "./hooks/usePatientActivityLogs";
import { ActivityCard } from "./components/ActivityCard";
import { ActivityLogTable } from "./components/activityLogTable";
import { AddActivityModal } from "./components/AddActivityModal";
import { EditActivityModal } from "./components/EditActivityModal";
import type { IPatientActivity } from "@/common/types/activities";
import { useAuthStore } from "@/store/useAuthStore";

export default function PatientActivities() {
  const { t, i18n } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const clinicId = useAuthStore((state) => state.clinicId);
  const role = useAuthStore((state) => state.role);
  const isDoctor = role === "DOCTOR";

  const {
    searchTerm,
    setSearchTerm,
    filteredActivities,
    handleDelete,
    isAddModalOpen,
    setIsAddModalOpen,
  } = usePatientActivities(clinicId!, userId!);

  const {
    activityLogs,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
  } = usePatientActivityLogs(clinicId!, userId!);

  const [editingActivity, setEditingActivity] =
    useState<IPatientActivity | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleEditModalClose = (open: boolean) => {
    if (!open) setEditingActivity(null);
  };

  return (
    <div
      className="p-4 space-y-6 bg-background min-h-screen text-left"
      dir={i18n.dir()}
    >
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
            placeholder={t("patientActivities.searchPlaceholder")}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Activity className="text-primary" size={20} />
            <span>{t("patientActivities.title")}</span>
          </div>

          {isDoctor && (
            <button
              onClick={openAddModal}
              className="text-primary text-sm font-semibold hover:underline cursor-pointer"
            >
              + {t("patientActivities.addActivity.title")}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDelete={handleDelete}
              onEdit={setEditingActivity}
              canManage={isDoctor}
            />
          ))}
        </div>

        <ActivityLogTable
          activityLogs={activityLogs}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onRefresh={refetch}
          activities={filteredActivities}
        />
      </div>

      {isDoctor && (
        <>
          <AddActivityModal
            isOpen={isAddModalOpen}
            setIsOpen={setIsAddModalOpen}
            userId={userId!}
            clinicId={clinicId!}
          />
          <EditActivityModal
            activity={editingActivity}
            isOpen={!!editingActivity}
            setIsOpen={handleEditModalClose}
            patientId={userId!}
          />
        </>
      )}
    </div>
  );
}