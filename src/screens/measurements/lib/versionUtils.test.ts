import { describe, it, expect } from "vitest";
import type { IQComponent } from "@/common/types/measurement";
import {
  branchNewVersion,
  switchActiveVersion,
  deleteVersion,
  getActiveVersionLabel,
  extractSnapshot,
  applySnapshot,
} from "./versionUtils";

function makeDropdown(overrides?: Partial<IQComponent>): IQComponent {
  return {
    id: "comp-1",
    type: "dropdown",
    label: "Test Dropdown",
    placeholder: "Select...",
    required: false,
    options: [{ id: "o1", label: "A", value: "a" }],
    correctAnswerType: "NONE",
    correctAnswer: "",
    grade: 0,
    ...overrides,
  } as IQComponent;
}

describe("extractSnapshot", () => {
  it("strips id, versions, and activeVersionId", () => {
    const comp = makeDropdown({
      versions: [],
      activeVersionId: "v-1",
    } as Partial<IQComponent>);
    const snap = extractSnapshot(comp);
    expect(snap).not.toHaveProperty("id");
    expect(snap).not.toHaveProperty("versions");
    expect(snap).not.toHaveProperty("activeVersionId");
    expect(snap).toHaveProperty("type", "dropdown");
    expect(snap).toHaveProperty("label", "Test Dropdown");
  });

  it("deep clones values", () => {
    const comp = makeDropdown();
    const snap = extractSnapshot(comp);
    (snap.options as Array<{ label: string }>)[0].label = "CHANGED";
    expect((comp as { options: Array<{ label: string }> }).options[0].label).toBe("A");
  });
});

describe("applySnapshot", () => {
  it("overwrites component properties from snapshot", () => {
    const comp = makeDropdown();
    const snap = { type: "dropdown", label: "Updated", placeholder: "Pick one", required: true, options: [], correctAnswerType: "NONE", correctAnswer: "", grade: 0 };
    const result = applySnapshot(comp, snap);
    expect(result.label).toBe("Updated");
    expect(result.id).toBe("comp-1");
  });
});

describe("branchNewVersion", () => {
  it("creates v1.0 and v2.0 on first branch", () => {
    const comp = makeDropdown();
    const result = branchNewVersion(comp);
    expect(result.versions).toHaveLength(2);
    expect(result.versions![0].versionLabel).toBe("v1.0");
    expect(result.versions![1].versionLabel).toBe("v2.0");
    expect(result.activeVersionId).toBe(result.versions![1].id);
  });

  it("creates next version from existing", () => {
    const comp = branchNewVersion(makeDropdown());
    const result = branchNewVersion(comp);
    expect(result.versions).toHaveLength(3);
    expect(result.versions![2].versionLabel).toBe("v3.0");
    expect(result.activeVersionId).toBe(result.versions![2].id);
  });

  it("preserves current properties in new version snapshot", () => {
    const comp = makeDropdown();
    const branched = branchNewVersion(comp);
    const snap = branched.versions![1].snapshot;
    expect(snap.label).toBe("Test Dropdown");
    expect(snap.type).toBe("dropdown");
  });
});

describe("switchActiveVersion", () => {
  it("switches to a different version", () => {
    const comp = branchNewVersion(makeDropdown());
    const v1Id = comp.versions![0].id;
    const v2Id = comp.versions![1].id;

    // Modify current (v2) label
    const modified = { ...comp, label: "Modified in v2" } as IQComponent;
    const switched = switchActiveVersion(modified, v1Id);

    expect(switched.activeVersionId).toBe(v1Id);
    expect(switched.label).toBe("Test Dropdown");
    // v2 snapshot should have the modified label
    const v2Snap = switched.versions!.find((v) => v.id === v2Id)!.snapshot;
    expect(v2Snap.label).toBe("Modified in v2");
  });

  it("returns same component if version not found", () => {
    const comp = branchNewVersion(makeDropdown());
    const result = switchActiveVersion(comp, "nonexistent");
    expect(result).toBe(comp);
  });

  it("returns same component if already active", () => {
    const comp = branchNewVersion(makeDropdown());
    const result = switchActiveVersion(comp, comp.activeVersionId!);
    expect(result).toBe(comp);
  });

  it("is a no-op on component without versions", () => {
    const comp = makeDropdown();
    const result = switchActiveVersion(comp, "any");
    expect(result).toBe(comp);
  });
});

describe("deleteVersion", () => {
  it("clears version fields when deleting last remaining version", () => {
    let comp = branchNewVersion(makeDropdown());
    comp = deleteVersion(comp, comp.versions![0].id);
    // Now only 1 version left, delete it
    const result = deleteVersion(comp, comp.versions![0].id);
    expect(result.versions).toBeUndefined();
    expect(result.activeVersionId).toBeUndefined();
  });

  it("falls back to another version when deleting active", () => {
    const comp = branchNewVersion(makeDropdown());
    const v1Id = comp.versions![0].id;
    const v2Id = comp.versions![1].id;
    // v2 is active, delete it
    const result = deleteVersion(comp, v2Id);
    expect(result.versions).toHaveLength(1);
    expect(result.activeVersionId).toBe(v1Id);
  });

  it("keeps active version when deleting a non-active version", () => {
    const comp = branchNewVersion(makeDropdown());
    const v1Id = comp.versions![0].id;
    const v2Id = comp.versions![1].id;
    const result = deleteVersion(comp, v1Id);
    expect(result.versions).toHaveLength(1);
    expect(result.activeVersionId).toBe(v2Id);
  });
});

describe("getActiveVersionLabel", () => {
  it("returns null for component without versions", () => {
    expect(getActiveVersionLabel(makeDropdown())).toBeNull();
  });

  it("returns the active version label", () => {
    const comp = branchNewVersion(makeDropdown());
    expect(getActiveVersionLabel(comp)).toBe("v2.0");
  });
});
