import { useTranslation } from "react-i18next";
import { useRole } from "@/hooks/common/useRole";
import { useMedications } from "./hooks/useMedications";
import { MedicationSearchSort } from "./components/MedicationSearchSort";
import { MedicationList } from "./components/MedicationList";
import { AddMedicationModal } from "./components/AddMedicationModal";
import { AddToClinicModal } from "./components/AddToClinicModal";

export default function Medications() {
  const { t } = useTranslation();
  const role = useRole();
  const {
    filteredMedications,
    totalCount,
    isLoading,
    error,
    viewMode,
    sortOptions,
    searchTerm,
    sortOption,
    handleSearchChange,
    handleSortChange,
    handleDelete,
  } = useMedications();

  const canDelete = role === "ADMIN" || role === "CLINIC_MANAGER";

  if (isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground font-medium">
        {t("home.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-destructive font-medium">
        {t("home.error")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {t("medications.title")}
            </h1>
          </div>
          {role === "ADMIN" && <AddMedicationModal />}
          {role === "CLINIC_MANAGER" && <AddToClinicModal />}
        </div>

        <MedicationSearchSort
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
        />

        <MedicationList
          medications={filteredMedications}
          viewMode={viewMode}
          canDelete={canDelete}
          onDelete={handleDelete}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
