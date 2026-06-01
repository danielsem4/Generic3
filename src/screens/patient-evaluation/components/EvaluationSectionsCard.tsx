import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Brain, Layers3 } from "lucide-react";
import SectionsGrid from "@/common/components/Patient+evaluationPage/SectionsGrid";
import type { ISectionItem, ISectionRouteMapper } from "@/common/types/section";

interface Props {
  readonly questionnaires?: ISectionItem[];
  readonly cognitiveTests?: ISectionItem[];
  readonly moduleQuestionnaires?: ISectionItem[];
}

export default function EvaluationSectionsCard({
  questionnaires = [],
  cognitiveTests = [],
  moduleQuestionnaires = [],
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const questionnaireActions: ISectionRouteMapper = Object.fromEntries(
    questionnaires.map((item) => [
      item.label,
      () =>
        navigate(`${item.id}/submissions`, {
          state: { evaluationName: item.label },
        }),
    ]),
  );

  const cognitiveTestActions: ISectionRouteMapper = Object.fromEntries(
    cognitiveTests.map((item) => [
      item.label,
      () =>
        navigate(`${item.id}/submissions`, {
          state: { evaluationName: item.label },
        }),
    ]),
  );

  const moduleQuestionnaireActions: ISectionRouteMapper = Object.fromEntries(
    moduleQuestionnaires.map((item) => [
      item.label,
      () =>
        navigate(`${item.id}/submissions`, {
          state: { evaluationName: item.label },
        }),
    ]),
  );

  const sections = [
    {
      title: t("patientEvaluations.questionnaires"),
      icon: ClipboardList,
      iconClassName: "text-chart-1",
      items: questionnaires,
      routeMapper: questionnaireActions,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("patientEvaluations.noData"),
    },
    {
      title: t("patientEvaluations.cognitiveTests"),
      icon: Brain,
      iconClassName: "text-chart-2",
      items: cognitiveTests,
      routeMapper: cognitiveTestActions,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("patientEvaluations.noData"),
    },
    {
      title: t("patientEvaluations.moduleQuestionnaire"),
      icon: Layers3,
      iconClassName: "text-chart-5",
      items: moduleQuestionnaires,
      routeMapper: moduleQuestionnaireActions,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("patientEvaluations.noData"),
    },
  ];

  return <SectionsGrid sections={sections} />;
}