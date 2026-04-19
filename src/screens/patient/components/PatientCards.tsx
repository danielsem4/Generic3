import { useNavigate } from "react-router-dom";
import { Activity, Pill, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionsGrid from "@/common/components/Patient+measurementPage/SectionsGrid";
import type { ISectionItem, ISectionRouteMapper } from "@/common/types/section";

interface Props {
  readonly functions?: ISectionItem[];
  readonly metrics?: ISectionItem[];
  readonly modules?: ISectionItem[];
}

export default function PatientSectionsCard({
  functions = [],
  metrics = [],
  modules = [],
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const MODULE_ACTIONS: ISectionRouteMapper = {
    Medications: () => navigate("medications"),
    Activities: () => navigate("activities"),
    Measurements: () => navigate("measurements"),
  };

  const METRIC_ACTIONS: ISectionRouteMapper = {};
  const FUNCTION_ACTIONS: ISectionRouteMapper = {};

  const sections = [
    {
      title: t("patient.modules"),
      icon: Pill,
      iconClassName: "text-chart-1",
      items: modules,
      routeMapper: MODULE_ACTIONS,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("patient.noData"),
    },
    {
      title: t("patient.metrics"),
      icon: Activity,
      iconClassName: "text-chart-2",
      items: metrics,
      routeMapper: METRIC_ACTIONS,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("patient.noData"),
    },
    {
      title: t("patient.customFunctions"),
      icon: BarChart3,
      iconClassName: "text-chart-5",
      items: functions,
      routeMapper: FUNCTION_ACTIONS,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("patient.noData"),
    },
  ];

  return <SectionsGrid sections={sections} />;
}