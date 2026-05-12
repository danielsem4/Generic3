import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Bell, CheckCircle2, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { IPatientActivity } from "@/common/types/activities";
import { DeleteButton } from "@/common/components/DeleteButton";

interface ActivityCardProps {
  activity: IPatientActivity;
  onDelete: (id: string) => void;
  onEdit: (activity: IPatientActivity) => void;
  canManage: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onDelete,
  onEdit,
  canManage,
}) => {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="border-border bg-card shadow-sm rounded-md overflow-hidden w-full mb-1">
      <CardContent className="p-0 px-4 flex justify-between items-center h-12">
        <div className="flex items-center gap-3">
          {canManage && (
            <div className="flex items-center gap-1 px-2 bg-muted/30 rounded-full border border-border h-8">
              
              <DeleteButton onClick={() => setDeleteOpen(true)} />

              <button
                onClick={() => onEdit(activity)}
                className="p-0.5 text-muted-foreground hover:text-primary border-x border-border px-2 cursor-pointer"
              >
                <Pencil size={15} />
              </button>

              <button className="p-1 text-muted-foreground hover:text-warning cursor-pointer">
                <Bell size={15} />
              </button>
            </div>
          )}

          <CheckCircle2 className="text-success opacity-90" size={18} />
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="flex flex-col justify-center leading-tight">
            <span className="font-bold text-foreground text-[15px] uppercase tracking-tight">
              {activity.activity_name}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              {activity.category ?? t("patientActivities.defaultSubtitle")}
            </span>
          </div>

          <div className="p-1.5 bg-primary/10 rounded-full">
            <Activity className="text-primary" size={20} />
          </div>
        </div>
      </CardContent>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("patientActivities.deleteConfirm.title")}
        description={t("patientActivities.deleteConfirm.description")}
        confirmLabel={t("patientActivities.deleteConfirm.confirm")}
        cancelLabel={t("patientActivities.deleteConfirm.cancel")}
        onConfirm={() => {
          onDelete(activity.id);
          setDeleteOpen(false);
        }}
        variant="destructive"
      />
    </Card>
  );
};