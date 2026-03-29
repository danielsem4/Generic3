import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { IUser } from "@/common/Users";

interface Props {
  isOpen: boolean;
  manager: IUser | null;
  onSelect: (clinicId: string) => void;
  onClose: () => void;
}

export function ClinicSelectDialog({ isOpen, manager, onSelect, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground">
            {t("clinicManagers.selectClinic")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t("clinicManagers.selectClinicDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {manager?.clinics.map((clinic) => (
            <button
              key={clinic.id}
              onClick={() => onSelect(clinic.id)}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/40 transition-colors text-left"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{clinic.clinic_name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{clinic.clinic_url}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
