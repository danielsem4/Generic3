import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import type { IMeasurementSubmissionAnswerRaw } from "@/common/types/patientMeasurementSubmission";
import { useState } from "react";

interface EditAnswerScoreDialogProps {
  answer: IMeasurementSubmissionAnswerRaw | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (answerId: string, score: number) => void;
}

export function EditAnswerScoreDialog({
  answer,
  open,
  onOpenChange,
  onSave,
}: EditAnswerScoreDialogProps) {
  const { t } = useTranslation();
  const [scoreValue, setScoreValue] = useState("");

  const handleSave = () => {
    if (!answer) return;

    onSave(answer.id, Number(scoreValue));
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen && answer) {
          setScoreValue(String(answer.points_earned ?? 0));
        }

        onOpenChange(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("measurements.editScore.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{answer?.label}</p>

          <Input
            type="number"
            min={0}
            value={scoreValue}
            onChange={(e) => setScoreValue(e.target.value)}
            placeholder={t("measurements.editScore.placeholder")}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("measurements.editScore.cancel")}
          </Button>

          <Button onClick={handleSave}>
            {t("measurements.editScore.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}