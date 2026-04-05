import { useTranslation } from "react-i18next";
import { PlusCircle, Search, Dumbbell, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useActivitiesPage } from "../hooks/useActivitiesPage";
import { ActivityItem } from "./ActivityItem";

export function ClinicActivitiesView() {
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {t("activities.title")}
          </h1>
          {isManager && (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm">
              <PlusCircle size={18} />
              {t("activities.addBtn")}
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="w-full pr-12 h-12 bg-card border-border shadow-sm focus-visible:ring-primary"
            placeholder={t("activities.searchPlaceholder")}
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Dumbbell className="text-primary" size={22} />
            <span>{t("activities.allActivities")} ({filtered.length})</span>
          </div>

          <div className="space-y-2">
            {filtered.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isManager={isManager}
                onDelete={openDelete}
              />
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                {t("activities.noActivities")}
              </div>
            )}
          </div>
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
    </div>
  );
}
