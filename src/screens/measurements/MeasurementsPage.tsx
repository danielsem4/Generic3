import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ruler, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeasurements } from "./hooks/useMeasurements";
import { MeasurementList } from "./components/MeasurementList";
import { CreateMeasurementDialog } from "./components/CreateMeasurementDialog";
import { DeleteMeasurementDialog } from "./components/DeleteMeasurementDialog";
import { AddExistingMeasurementDialog } from "./components/AddExistingMeasurementDialog";

export default function MeasurementsPage() {
  const { t } = useTranslation();
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const {
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
  } = useMeasurements();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 p-2.5 rounded-xl text-sky-600 shadow-sm">
            <Ruler size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t("measurements.title")}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddExistingOpen(true)}
            className="rounded-full gap-2 px-6 font-bold"
          >
            <Plus size={18} strokeWidth={3} />
            {t("measurements.addExisting")}
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full gap-2 px-6 shadow-lg font-bold hover:opacity-90 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            {t("measurements.createNew")}
          </Button>
        </div>
      </div>

      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
          size={20}
        />
        <Input
          className="pl-12 h-14 bg-card border-none shadow-sm rounded-2xl text-lg focus-visible:ring-1 focus-visible:ring-primary/20"
          placeholder={t("measurements.searchPlaceholder")}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <MeasurementList
          groups={groupedMeasurements}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          onDuplicate={handleDuplicate}
        />
      )}

      <CreateMeasurementDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreate}
        isSubmitting={isSubmitting}
      />

      <DeleteMeasurementDialog
        measurement={deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <AddExistingMeasurementDialog
        open={isAddExistingOpen}
        onOpenChange={setIsAddExistingOpen}
        onAdd={() => {}}
      />
    </div>
  );
}
