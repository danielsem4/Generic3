import type { IQComponent, IQComponentVersion } from "@/common/types/measurement";

const VERSION_KEYS_TO_STRIP = new Set(["id", "versions", "activeVersionId"]);

export function extractSnapshot(
  component: IQComponent,
): Record<string, unknown> {
  const snapshot: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(component)) {
    if (!VERSION_KEYS_TO_STRIP.has(key)) {
      snapshot[key] = structuredClone(value);
    }
  }
  return snapshot;
}

export function applySnapshot(
  component: IQComponent,
  snapshot: Record<string, unknown>,
): IQComponent {
  const result = { ...component };
  for (const key of Object.keys(result)) {
    if (!VERSION_KEYS_TO_STRIP.has(key)) {
      delete (result as Record<string, unknown>)[key];
    }
  }
  for (const [key, value] of Object.entries(snapshot)) {
    if (!VERSION_KEYS_TO_STRIP.has(key)) {
      (result as Record<string, unknown>)[key] = structuredClone(value);
    }
  }
  return result as IQComponent;
}

function nextVersionLabel(versions: IQComponentVersion[]): string {
  const maxNum = versions.reduce((max, v) => {
    const match = v.versionLabel.match(/^v(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `v${maxNum + 1}.0`;
}

export function branchNewVersion(component: IQComponent): IQComponent {
  const existing = component.versions ?? [];
  const now = new Date().toISOString();

  if (existing.length === 0) {
    const v1: IQComponentVersion = {
      id: crypto.randomUUID(),
      versionLabel: "v1.0",
      snapshot: extractSnapshot(component),
      createdAt: now,
    };
    const v2: IQComponentVersion = {
      id: crypto.randomUUID(),
      versionLabel: "v2.0",
      snapshot: extractSnapshot(component),
      createdAt: now,
    };
    return { ...component, versions: [v1, v2], activeVersionId: v2.id };
  }

  const activeId = component.activeVersionId;
  const updatedVersions = existing.map((v) =>
    v.id === activeId ? { ...v, snapshot: extractSnapshot(component) } : v,
  );

  const newVersion: IQComponentVersion = {
    id: crypto.randomUUID(),
    versionLabel: nextVersionLabel(existing),
    snapshot: extractSnapshot(component),
    createdAt: now,
  };

  return {
    ...component,
    versions: [...updatedVersions, newVersion],
    activeVersionId: newVersion.id,
  };
}

export function switchActiveVersion(
  component: IQComponent,
  versionId: string,
): IQComponent {
  const versions = component.versions ?? [];
  if (versions.length === 0) return component;

  const target = versions.find((v) => v.id === versionId);
  if (!target) return component;
  if (versionId === component.activeVersionId) return component;

  const activeId = component.activeVersionId;
  const updatedVersions = versions.map((v) =>
    v.id === activeId ? { ...v, snapshot: extractSnapshot(component) } : v,
  );

  const updated = applySnapshot(component, target.snapshot);
  return { ...updated, versions: updatedVersions, activeVersionId: versionId };
}

export function deleteVersion(
  component: IQComponent,
  versionId: string,
): IQComponent {
  const versions = component.versions ?? [];
  if (versions.length <= 1) {
    return { ...component, versions: undefined, activeVersionId: undefined };
  }

  const filtered = versions.filter((v) => v.id !== versionId);

  if (versionId === component.activeVersionId) {
    const fallback = filtered[filtered.length - 1];
    const updated = applySnapshot(component, fallback.snapshot);
    return { ...updated, versions: filtered, activeVersionId: fallback.id };
  }

  return { ...component, versions: filtered };
}

export function switchToVersionByLabel(
  component: IQComponent,
  targetLabel: string,
): IQComponent {
  const versions = component.versions ?? [];
  if (versions.length === 0) return component;

  const target = versions.find((v) => v.versionLabel === targetLabel);
  const fallback = versions[0];
  const chosen = target ?? fallback;

  if (chosen.id === component.activeVersionId) return component;
  return switchActiveVersion(component, chosen.id);
}

export function collectVersionLabels(
  components: IQComponent[],
): string[] {
  const labels = new Set<string>();
  for (const comp of components) {
    if (comp.versions) {
      for (const v of comp.versions) labels.add(v.versionLabel);
    }
    if (comp.type === "rowContainer") {
      for (const label of collectVersionLabels(comp.children)) {
        labels.add(label);
      }
    }
  }
  return [...labels].sort();
}

export function getActiveVersionLabel(
  component: IQComponent,
): string | null {
  const versions = component.versions ?? [];
  if (versions.length === 0) return null;
  const active = versions.find((v) => v.id === component.activeVersionId);
  return active?.versionLabel ?? null;
}
