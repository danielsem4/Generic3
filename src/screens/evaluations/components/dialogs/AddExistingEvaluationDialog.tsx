import { useTranslation } from "react-i18next";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EvaluationType } from "@/common/types/evaluation";
import type { IEvaluation } from "@/common/types/evaluation";
import { useAddExistingEvaluation } from "../../hooks/list-page/useAddExistingEvaluation";
import { LoadingButton } from "@/components/ui/LoadingButton";

const TYPE_LABEL_KEYS: Record<EvaluationType, string> = {
  [EvaluationType.QUESTIONNAIRES]: "evaluations.types.questionnaries",
  [EvaluationType.COGNITIVE_TESTS]: "evaluations.types.cognitiveTests",
  [EvaluationType.MODULE_QUESTIONNAIRE]: "evaluations.types.moduleQuestionnaire",
};

interface AddExistingEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicEvaluations: IEvaluation[];
  onAdoptSuccess: () => void;
}

export function AddExistingEvaluationDialog({
  open,
  onOpenChange,
  clinicEvaluations,
  onAdoptSuccess,
}: AddExistingEvaluationDialogProps) {
  const { t } = useTranslation();
  const {
    searchTerm,
    handleSearchChange,
    filteredEvaluations,
    selectedIds,
    handleToggle,
    handleSelectAll,
    handleDeselectAll,
    allSelected,
    handleAdopt,
    handleClose,
    isLoadingPublic,
    isAdopting,
    showAdopted,
    handleToggleShowAdopted,
    clinicIds,
  } = useAddExistingEvaluation(clinicEvaluations);

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) handleClose();
    onOpenChange(isOpen);
  }

  async function handleConfirm() {
    const success = await handleAdopt();
    if (success) {
      handleClose();
      onAdoptSuccess();
    }
  }

  function handleToggleAll() {
    if (allSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("evaluations.addExistingTitle")}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none"
          />
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t("evaluations.searchExisting")}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="show-adopted"
            checked={showAdopted}
            onCheckedChange={handleToggleShowAdopted}
          />
          <Label htmlFor="show-adopted" className="text-sm cursor-pointer">
            {t("evaluations.showAdopted")}
          </Label>
        </div>

        <div className="max-h-64 overflow-y-auto border border-border rounded-md">
          {isLoadingPublic ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t("evaluations.noExistingData")}
            </p>
          ) : (
            <>
              <label className="flex items-center gap-3 p-2 border-b border-border cursor-pointer hover:bg-accent">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="accent-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  {allSelected
                    ? t("evaluations.deselectAll")
                    : t("evaluations.selectAll")}
                </span>
              </label>
              {filteredEvaluations.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-accent ${
                    selectedIds.has(m.id) ? "bg-accent" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(m.id)}
                    onChange={() => handleToggle(m.id)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{m.name}</span>
                  {clinicIds.has(m.id) && (
                    <Badge variant="secondary" className="text-xs">
                      {t("evaluations.alreadyAdded")}
                    </Badge>
                  )}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {t(TYPE_LABEL_KEYS[m.type])}
                  </Badge>
                </label>
              ))}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t("evaluations.cancel")}
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            loading={isAdopting}
            loadingText={t("common.loading.adding", "Adding...")} // או מפתח תרגום רלוונטי
          >
            {t("evaluations.addCount", { count: selectedIds.size })}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
