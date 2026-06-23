import { useTranslation } from "react-i18next";
import { LineChart, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { useRole } from "@/hooks/common/useRole";
import { useGraphs } from "./hooks/list-page/useGraphs";
import { GraphList } from "./components/list-view/GraphList";
import { DeleteGraphDialog } from "./components/dialogs/DeleteGraphDialog";

export default function GraphsPage() {
  const { t } = useTranslation();
  const role = useRole();
  const isReadOnly = role === "DOCTOR";
  const {
    graphs,
    searchTerm,
    handleSearchChange,
    handleCreate,
    handleEdit,
    deleteTarget,
    setDeleteTarget,
    handleDelete,
    isDeleting,
    isLoading,
  } = useGraphs();

  function handleDeleteOpenChange(open: boolean) {
    if (!open) setDeleteTarget(null);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600 shadow-sm">
            <LineChart size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t("graphs.title")}
          </h1>
        </div>

        {!isReadOnly && (
          <Button
            onClick={handleCreate}
            className="rounded-full gap-2 px-6 font-bold shadow-lg transition-all hover:opacity-90"
          >
            <Plus size={18} strokeWidth={3} />
            {t("graphs.createNew")}
          </Button>
        )}
      </div>

      <div className="group relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
          size={20}
        />
        <Input
          className="h-14 rounded-2xl border-none bg-card pl-12 text-lg shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20"
          placeholder={t("graphs.searchPlaceholder")}
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
        <GraphList
          graphs={graphs}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {!isReadOnly && (
        <DeleteGraphDialog
          graph={deleteTarget}
          onOpenChange={handleDeleteOpenChange}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
