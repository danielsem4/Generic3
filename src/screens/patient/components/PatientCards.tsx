import { useNavigate } from "react-router-dom";
import { Activity, Pill, BarChart3, LineChart } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionsGrid from "@/common/components/Patient+evaluationPage/SectionsGrid";
import type { ISectionItem, ISectionRouteMapper } from "@/common/types/section";
import { usePatientGraphSection } from "@/screens/patient/hooks/usePatientGraphSection";

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
    Evaluations: () => navigate("evaluations"),
    "File Share": () => navigate("files")
  };

  const SENSORS_LABEL = t("parkinsonSensors.title");
  const hasParkinsonSensors = modules.some((module) =>
    module.label.toLowerCase().includes("parkinson sensors"),
  );

  const moduleItems: ISectionItem[] = modules.filter(
    (module) => !module.label.toLowerCase().includes("parkinson sensors"),
  );

  const metricItems: ISectionItem[] = hasParkinsonSensors
    ? [...metrics, { id: "parkinson-sensors", label: SENSORS_LABEL }]
    : metrics;

  const METRIC_ACTIONS: ISectionRouteMapper = hasParkinsonSensors
    ? { [SENSORS_LABEL]: () => navigate("sensors") }
    : {};
  const FUNCTION_ACTIONS: ISectionRouteMapper = {};

  const { graphItems, graphActions } = usePatientGraphSection();

  const sections = [
    {
      title: t("patient.modules"),
      icon: Pill,
      iconClassName: "text-chart-1",
      items: moduleItems,
      routeMapper: MODULE_ACTIONS,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("patient.noData"),
    },
    {
      title: t("patient.metrics"),
      icon: Activity,
      iconClassName: "text-chart-2",
      items: metricItems,
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
    {
      title: t("patient.graphs"),
      icon: LineChart,
      iconClassName: "text-chart-3",
      items: graphItems,
      routeMapper: graphActions,
      editLabel: t("patient.editDetails"),
      enableLabel: t("patient.enable"),
      emptyLabel: t("graphs.empty"),
    },
  ];

  return <SectionsGrid sections={sections} />;
}