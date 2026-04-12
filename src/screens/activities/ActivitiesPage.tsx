import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Dumbbell, Loader2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
import { ActivityDetailsDialog } from "./components/ActivityDetailsDialog";
import { AddActivityToClinicDialog } from "./components/AddActivityToClinic";
import { removeActivityFromClinic } from "@/api/activitiesApi";
import { useAuthStore } from "@/store/useAuthStore";

  
export default function ActivitiesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  const { clinicId } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { activities, isLoading, isManager } = useClinicActivities();

  const deleteMutation = useMutation({
    mutationFn: (activityId: string) => removeActivityFromClinic(clinicId!, activityId),
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["clinic-activities", clinicId] });
    setActivityToDelete(null); 
    console.log("Activity removed from clinic successfully");
  },
  onError: (error) => {
    console.error("Failed to remove activity from clinic:", error);
  },
  });

  const filtered = activities.filter((act) =>
    act.activity_name.toLowerCase().includes(search.toLowerCase())
  );


  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }
console.log("Current selected ID:", selectedActivityId);
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
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="rounded-full gap-2 px-6 shadow-lg font-bold hover:opacity-90 transition-all"
          >
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
          index={index}
          isManager={isManager}
          onViewDetails={() => setSelectedActivityId(activity.activity)} 
onDelete={() => setActivityToDelete(activity.activity)}           />
        ))}
      </div>

      <AddActivityToClinicDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />

      <ActivityDetailsDialog 
        activityId={selectedActivityId} 
        onClose={() => setSelectedActivityId(null)} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!activityToDelete} onOpenChange={() => setActivityToDelete(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.areYouSure") || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("activities.deleteWarning") || "This action cannot be undone. This will permanently delete the activity from the clinic."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t("common.cancel") || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
           onClick={() => {
           if (activityToDelete) {
           deleteMutation.mutate(activityToDelete);
          }
           }}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
           >
           {deleteMutation.isPending ? "Deleting..." : t("common.delete")}
          </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}