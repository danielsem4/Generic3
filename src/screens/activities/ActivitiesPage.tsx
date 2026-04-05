import { useTranslation } from "react-i18next";
import { Plus, Search, Dumbbell, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useActivitiesPage } from "./hooks/useActivitiesPage";
import { ActivityItem } from "./components/ActivityItem";

export default function ActivitiesPage() {
  const { t } = useTranslation();
  const {
    filtered,
    isLoading,
    error,
    isManager,
    search,
    activityToDelete,
    handleSearchChange,
    openDelete,
    closeDelete,
    handleDeleteConfirm,
  } = useActivitiesPage();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{t("home.error")}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 text-left">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary shadow-sm">
            <Dumbbell size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t("activities.title")}
          </h1>
        </div>

        {isManager && (
          <Button className="rounded-full gap-2 px-6 shadow-lg font-bold hover:opacity-90 transition-all">
            <Plus size={18} strokeWidth={3} />
            {t("activities.addBtn")}
          </Button>
        )}
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <Input
          className="pl-12 h-14 bg-card border-none shadow-sm rounded-2xl text-lg focus-visible:ring-1 focus-visible:ring-primary/20"
          placeholder={t("activities.searchPlaceholder")}
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
          {t("activities.allActivities")} ({filtered.length})
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            {t("activities.noActivities")}
          </p>
        ) : (
          filtered.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isManager={isManager}
              index={index}
              onDelete={openDelete}
              onViewDetails={(id) => console.log("Open details for:", id)}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!activityToDelete}
        onOpenChange={(open) => { if (!open) closeDelete(); }}
        title={t("common.areYouSure")}
        description={t("activities.deleteWarning")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
