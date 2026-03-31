import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Dumbbell, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useClinicActivities } from "./hooks/useClinicActivities";
import { ActivityItem } from "./components/ActivityItem";

export default function ActivitiesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  
  const { activities, isLoading, isManager } = useClinicActivities();

  const filtered = activities.filter((act) =>
    act.activity_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      console.log("Deleting activity:", activityToDelete);
      setActivityToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 text-left" dir="ltr">
            <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" /> 
    
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary shadow-sm">
            <Dumbbell size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t("activities.title") || "Activities"}
          </h1>
        </div>

        {isManager && (
          <Button className="rounded-full gap-2 px-6 shadow-lg font-bold hover:opacity-90 transition-all">
            <Plus size={18} strokeWidth={3} />
            {t("activities.addBtn") || "Add New Activity"}
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <Input 
          className="pl-12 h-14 bg-card border-none shadow-sm rounded-2xl text-lg focus-visible:ring-1 focus-visible:ring-primary/20" 
          placeholder={t("activities.searchPlaceholder") || "Search for an activity..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Activities List */}
      <div className="space-y-3 pt-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
          {t("activities.allActivities") || "All Activities"} ({filtered.length})
        </p>
        
        {filtered.map((activity, index) => (
          <ActivityItem 
            key={activity.id} 
            activity={activity} 
            isManager={isManager} 
            index={index}
            onDelete={(id) => setActivityToDelete(id)} 
            onViewDetails={(id) => console.log("Open details for:", id)} 
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!activityToDelete} onOpenChange={() => setActivityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.areYouSure") || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("activities.deleteWarning") || "This action cannot be undone. This will permanently delete the activity from the clinic."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t("common.cancel") || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:opacity-90 rounded-xl px-6 font-bold transition-all"            >
              {t("common.delete") || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}