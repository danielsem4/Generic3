import { useEvaluationBuilderStore } from "@/store/useEvaluationBuilderStore";
import { collectVersionLabels } from "../../lib/versionUtils";

export function useGlobalVersionSwitcher() {
  const screens = useEvaluationBuilderStore((s) => s.screens);
  const switchAllComponentsVersion = useEvaluationBuilderStore(
    (s) => s.switchAllComponentsVersion,
  );

  const versionLabels = screens.flatMap((screen) =>
    collectVersionLabels(screen.components),
  ).filter((label, i, arr) => arr.indexOf(label) === i).sort();
  const hasVersions = versionLabels.length > 0;

  function handleSwitchAll(label: string) {
    switchAllComponentsVersion(label);
  }

  return {
    versionLabels,
    hasVersions,
    handleSwitchAll,
  };
}
