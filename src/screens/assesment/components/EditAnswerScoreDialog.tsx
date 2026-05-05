import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IMeasurementSubmissionAnswerRaw } from "@/common/types/patientMeasurementSubmission";

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

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (isOpen && answer) {
      setScoreValue(String(answer.points_earned ?? 0));
    }
    onOpenChange(isOpen);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScoreValue(e.target.value);
  };

  const handleSave = () => {
    if (!answer) return;
    const parsed = Number(scoreValue);
    if (isNaN(parsed) || parsed < 0) return;
    onSave(answer.id, parsed);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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
            onChange={handleScoreChange}
            placeholder={t("measurements.editScore.placeholder")}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
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
