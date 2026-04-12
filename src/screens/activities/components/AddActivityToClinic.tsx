import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search, Loader2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllSystemActivities, addActivityToClinic } from "@/api/activitiesApi";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddActivityToClinicDialog = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const { clinicId } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: allActivities = [], isLoading } = useQuery({
    queryKey: ["all-system-activities"],
    queryFn: getAllSystemActivities,
    enabled: isOpen, 
  });

  const handleSelect = (id: string) => {
  setSelectedId(prev => prev === id ? null : id);
};

  const addMutation = useMutation({
    mutationFn: (activityId: string) => addActivityToClinic(clinicId!, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-activities", clinicId] });
      onClose();
      setSelectedId(null);
      console.log("Activity added successfully and dialog closed!");
      },
      onError: (error) => {
      console.error("Failed to add activity:", error);
    },
  });


  const filtered = allActivities.filter((act) =>
    act.activity_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black tracking-tight text-center w-full">
              {t("activities.addBtn") || "Add Activity to Clinic"}
            </DialogTitle>
          </div>
          
          <div className="relative mt-6 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input
              placeholder={t("activities.searchPlaceholder")}
              className="pl-11 h-12 bg-muted/50 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </DialogHeader>

        <div className="max-h-[350px] overflow-y-auto p-4 space-y-1">
          {isLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            filtered.map((activity) => (
              <div
              key={activity.id}
              onClick={() => handleSelect(activity.id)} 
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedId === activity.id 
              ? "bg-primary/10 border-primary/20 shadow-sm" 
              : "hover:bg-muted/50 border-transparent"
              } border`}
               >
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">{activity.activity_name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{activity.activity_description}</span>
                </div>
                {selectedId === activity.id && (
                   <div className="bg-primary text-primary-foreground p-1 rounded-full shadow-sm ring-2 ring-primary/20">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-6 pt-2 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button 
            className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-primary/20" 
            disabled={!selectedId || addMutation.isPending}
            onClick={() => selectedId && addMutation.mutate(selectedId)}
          >
            {addMutation.isPending ? <Loader2 className="animate-spin" /> : t("common.confirm") || "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};