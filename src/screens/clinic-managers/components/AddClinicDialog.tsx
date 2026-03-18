import { useTranslation } from "react-i18next";
import { PlusCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddClinicDialog, TOTAL_STEPS } from "../hooks/useAddClinicDialog";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Modules } from "./steps/Step2Modules";
import { Step3Manager } from "./steps/Step3Manager";
import { ClinicSuccessView } from "./ClinicSuccessView";

const STEP_KEYS = [
  "clinicManagers.step1",
  "clinicManagers.step2",
  "clinicManagers.step3",
];

export function AddClinicDialog() {
  const { t } = useTranslation();
  const {
    open,
    step,
    isSuccess,
    form,
    isSubmitting,
    handleNext,
    handleBack,
    handleClose,
    onSubmit,
  } = useAddClinicDialog();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm transition-all">
          <PlusCircle size={20} /> {t("clinicManagers.addNew")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 bg-card border-border p-8">
        {isSuccess ? (
          <ClinicSuccessView onClose={() => handleClose(false)} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold text-center text-foreground">
                {t("clinicManagers.registerTitle")}
              </DialogTitle>
            </DialogHeader>

            {/* Progress bar */}
            <div className="flex gap-2 mt-2">
              {STEP_KEYS.map((key, i) => (
                <div key={key} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full h-1.5 rounded-full transition-colors duration-300",
                      i + 1 <= step ? "bg-primary" : "bg-muted",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      i + 1 === step ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
              {step === 1 && <Step1BasicInfo form={form} />}
              {step === 2 && <Step2Modules form={form} />}
              {step === 3 && <Step3Manager form={form} />}

              <div className="flex gap-3 pt-1">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    {t("clinicManagers.back")}
                  </Button>
                )}
                {step < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    {t("clinicManagers.next")}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("clinicManagers.creating")}
                      </>
                    ) : (
                      t("clinicManagers.registerButton")
                    )}
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
