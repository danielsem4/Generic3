import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingButton } from "@/components/ui/LoadingButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useGraphBuilder } from "./hooks/builder/useGraphBuilder";
import { AxisSelector } from "./components/config/AxisSelector";

const selectClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30";

export default function GraphBuilder() {
  const { t } = useTranslation();
  const {
    form,
    errors,
    elements,
    evaluations,
    isEdit,
    isSaving,
    setName,
    setDescription,
    setEvaluationId,
    updateAxis,
    handleSave,
    handleBack,
  } = useGraphBuilder();

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDescription(e.target.value);
  }

  function handleEvaluationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEvaluationId(e.target.value);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6 md:p-8">
      <BackButton />

      <Card className="rounded-2xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            {isEdit ? t("graphs.editTitle") : t("graphs.createTitle")}
          </CardTitle>
          <CardDescription>
            {isEdit ? t("graphs.editSubtitle") : t("graphs.createSubtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {t("graphs.basicInfoSection")}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="graph-name">{t("graphs.nameLabel")}</Label>
                <Input
                  id="graph-name"
                  placeholder={t("graphs.namePlaceholder")}
                  value={form.name}
                  onChange={handleNameChange}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{t(errors.name)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="graph-evaluation">
                  {t("graphs.questionnaireLabel")}
                </Label>
                <select
                  id="graph-evaluation"
                  className={selectClass}
                  value={form.evaluationId}
                  onChange={handleEvaluationChange}
                >
                  <option value="">{t("graphs.selectQuestionnaire")}</option>
                  {evaluations.map((evaluation) => (
                    <option key={evaluation.id} value={evaluation.id}>
                      {evaluation.name}
                    </option>
                  ))}
                </select>
                {errors.evaluationId && (
                  <p className="text-sm text-destructive">
                    {t(errors.evaluationId)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="graph-description">
                {t("graphs.descriptionLabel")}
              </Label>
              <Input
                id="graph-description"
                placeholder={t("graphs.descriptionPlaceholder")}
                value={form.description ?? ""}
                onChange={handleDescriptionChange}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {t("graphs.axisSection")}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AxisSelector
                title={t("graphs.xAxisLabel")}
                axis={form.xAxis}
                elements={elements}
                onChange={(patch) => updateAxis("xAxis", patch)}
                error={errors["xAxis.elementId"]}
              />
              <AxisSelector
                title={t("graphs.yAxisLabel")}
                axis={form.yAxis}
                elements={elements}
                onChange={(patch) => updateAxis("yAxis", patch)}
                error={errors["yAxis.elementId"]}
              />
            </div>
          </section>
        </CardContent>

        <CardFooter className="justify-end gap-2 border-t">
          <Button type="button" variant="outline" onClick={handleBack}>
            {t("graphs.cancel")}
          </Button>
          <LoadingButton
            onClick={handleSave}
            loading={isSaving}
            loadingText={t("common.loading.saving", "Saving...")}
          >
            {t("graphs.save")}
          </LoadingButton>
        </CardFooter>
      </Card>
    </div>
  );
}
