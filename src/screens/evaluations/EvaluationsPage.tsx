import { useTranslation } from "react-i18next";
import { Ruler, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/hooks/common/useRole";
import { useEvaluations } from "./hooks/list-page/useEvaluations";
import { EvaluationList } from "./components/list-view/EvaluationList";
import { CreateEvaluationDialog } from "./components/dialogs/CreateEvaluationDialog";
import { DeleteEvaluationDialog } from "./components/dialogs/DeleteEvaluationDialog";
import { EditEvaluationDialog } from "./components/dialogs/EditEvaluationDialog";
import { AddExistingEvaluationDialog } from "./components/dialogs/AddExistingEvaluationDialog";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";


export default function EvaluationsPage() {
  const { t } = useTranslation();
  const role = useRole();
  const isReadOnly = role === "DOCTOR";
  const {
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
  } = useEvaluations();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      < BackButton />
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 p-2.5 rounded-xl text-sky-600 shadow-sm">
            <Ruler size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t("evaluations.title")}
          </h1>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddExistingOpen(true)}
              className="rounded-full gap-2 px-6 font-bold"
            >
              <Plus size={18} strokeWidth={3} />
              {t("evaluations.addExisting")}
            </Button>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-full gap-2 px-6 shadow-lg font-bold hover:opacity-90 transition-all"
            >
              <Plus size={18} strokeWidth={3} />
              {t("evaluations.createNew")}
            </Button>
          </div>
        )}
      </div>

      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
          size={20}
        />
        <Input
          className="pl-12 h-14 bg-card border-none shadow-sm rounded-2xl text-lg focus-visible:ring-1 focus-visible:ring-primary/20"
          placeholder={t("evaluations.searchPlaceholder")}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner 
          title={t("common.loading.title")} 
          description={t("common.loading.fetchData")} 
        />
      ) : (
        <EvaluationList
          groups={groupedEvaluations}
          onEdit={handleEdit}
          onEditMetadata={handleEditMetadata}
          onDelete={setDeleteTarget}
          onDuplicate={handleDuplicate}
          readOnly={isReadOnly}
        />
      )}

      {!isReadOnly && (
        <>
          <CreateEvaluationDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onCreate={handleCreate}
            isSubmitting={isSubmitting}
          />

          <DeleteEvaluationDialog
            evaluation={deleteTarget}
            onOpenChange={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />

          <EditEvaluationDialog
            evaluation={editTarget}
            onOpenChange={() => setEditTarget(null)}
            onConfirm={handleUpdate}
            isUpdating={isUpdating}
          />

          <AddExistingEvaluationDialog
            open={isAddExistingOpen}
            onOpenChange={setIsAddExistingOpen}
            clinicEvaluations={evaluations}
            onAdoptSuccess={handleAdoptSuccess}
          />
        </>
      )}
    </div>
  );
}
