import {
  useEvaluationBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useEvaluationBuilderStore";
import { findComponentById } from "../../lib/treeUtils";
import { getActiveVersionLabel } from "../../lib/versionUtils";

export function useVersionControl() {
  const components = useEvaluationBuilderStore(selectActiveScreenComponents);
  const selectedComponentId = useEvaluationBuilderStore(
    (s) => s.selectedComponentId,
  );
  const branchComponentVersion = useEvaluationBuilderStore(
    (s) => s.branchComponentVersion,
  );
  const switchComponentVersion = useEvaluationBuilderStore(
    (s) => s.switchComponentVersion,
  );
  const deleteComponentVersion = useEvaluationBuilderStore(
    (s) => s.deleteComponentVersion,
  );

  const found = selectedComponentId
    ? findComponentById(components, selectedComponentId)
    : undefined;
  const component = found?.component ?? null;

  const versions = component?.versions ?? [];
  const activeVersionId = component?.activeVersionId ?? null;
  const activeVersionLabel = component
    ? getActiveVersionLabel(component)
    : null;
  const hasVersions = versions.length > 0;

  function handleBranchVersion() {
    if (!selectedComponentId) return;
    branchComponentVersion(selectedComponentId);
  }

  function handleSwitchVersion(versionId: string) {
    if (!selectedComponentId) return;
    switchComponentVersion(selectedComponentId, versionId);
  }

  function handleDeleteVersion(versionId: string) {
    if (!selectedComponentId) return;
    deleteComponentVersion(selectedComponentId, versionId);
  }

  return {
    versions,
    activeVersionId,
    activeVersionLabel,
    hasVersions,
    handleBranchVersion,
    handleSwitchVersion,
    handleDeleteVersion,
  };
}
