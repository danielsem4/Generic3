import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";
import { findComponentById } from "../../lib/treeUtils";
import { getActiveVersionLabel } from "../../lib/versionUtils";

export function useVersionControl() {
  const components = useMeasurementBuilderStore(selectActiveScreenComponents);
  const selectedComponentId = useMeasurementBuilderStore(
    (s) => s.selectedComponentId,
  );
  const branchComponentVersion = useMeasurementBuilderStore(
    (s) => s.branchComponentVersion,
  );
  const switchComponentVersion = useMeasurementBuilderStore(
    (s) => s.switchComponentVersion,
  );
  const deleteComponentVersion = useMeasurementBuilderStore(
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
