import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Info, Activity as ActivityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivityById } from "@/api/activitiesApi";

interface Props {
  activityId: string | null;
  onClose: () => void;
}

export const ActivityDetailsDialog = ({ activityId, onClose }: Props) => {
  const { t } = useTranslation();

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity-details", activityId],
    queryFn: () => getActivityById(activityId!),
    enabled: !!activityId,
  });

  return (
    <Dialog open={!!activityId} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[32px] p-6 border-none shadow-2xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 border-b border-border/50">
          {/* אייקון דקורטיבי */}
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <ActivityIcon size={24} strokeWidth={2.5} />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight leading-tight">
            {isLoading ? t("common.loading") : activity?.activity_name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm text-muted-foreground font-medium italic">
                {t("common.fetchingDetails")}
              </p>
            </div>
          ) : (
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 transition-all">
              <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                <Info size={14} />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em]">
                  {t("activities.descriptionLabel")}
                </h4>
              </div>
              <p className="text-foreground text-lg leading-relaxed font-medium">
                {activity?.activity_description || t("common.noDescription")}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onClose}
            className="rounded-xl px-8 font-bold"
          >
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};