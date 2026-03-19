import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAddMedicationDialog } from "../hooks/useAddMedicationDialog";

const MED_FORMS = ["TAB", "CAP", "GEL", "SUS", "VAC", "INJ", "CRE", "OIN", "DRO", "SPR"];
const MED_UNITS = ["MG", "ML", "MCG", "IU", "MEQ", "G"];

export function AddMedicationModal() {
  const { t } = useTranslation();
  const { open, form, isSubmitting, handleClose, onSubmit } = useAddMedicationDialog();
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm">
          <PlusCircle size={18} /> {t("medications.addNew")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground mb-4">
            {t("medications.registerTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-foreground">
              {t("medications.medNameLabel")} <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("medName")}
              placeholder={t("medications.medNamePlaceholder")}
              className={errors.medName ? "border-destructive" : "border-border"}
            />
            {errors.medName && (
              <p className="text-[10px] text-destructive font-medium">
                {t(errors.medName.message as string)}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label className="font-bold text-foreground">{t("medications.medFormLabel")}</Label>
              <select
                {...register("medForm")}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">—</option>
                {MED_FORMS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="space-y-1.5 flex-1">
              <Label className="font-bold text-foreground">{t("medications.medUnitLabel")}</Label>
              <select
                {...register("medUnit")}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">—</option>
                {MED_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold rounded-full mt-2"
          >
            {t("medications.registerButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
