import { describe, it, expect, beforeEach } from "vitest";
import type { IQScreen } from "@/common/types/measurement";
import { useMeasurementBuilderStore } from "./useMeasurementBuilderStore";

function makeScreen(id: string, title: string): IQScreen {
  return { id, title, components: [] };
}

function seedScreens(screens: IQScreen[], activeScreenIndex = 0) {
  useMeasurementBuilderStore.setState({
    screens,
    activeScreenIndex,
    selectedComponentId: null,
    isDirty: false,
  });
}

describe("reorderScreens", () => {
  beforeEach(() => {
    useMeasurementBuilderStore.setState({
      measurements: [],
      activeMeasurementId: null,
      screens: [],
      activeScreenIndex: 0,
      selectedComponentId: null,
      isPreviewMode: false,
      previewDevice: "mobile",
      isDirty: false,
    });
  });

  it("reorders screens so ids appear in new order", () => {
    seedScreens([
      makeScreen("a", "Screen 1"),
      makeScreen("b", "Screen 2"),
      makeScreen("c", "Screen 3"),
      makeScreen("d", "Screen 4"),
    ]);

    useMeasurementBuilderStore.getState().reorderScreens(2, 0);

    const ids = useMeasurementBuilderStore.getState().screens.map((s) => s.id);
    expect(ids).toEqual(["c", "a", "b", "d"]);
  });

  it("keeps activeScreenIndex on the same screen when the active screen is moved", () => {
    seedScreens(
      [
        makeScreen("a", "Screen 1"),
        makeScreen("b", "Screen 2"),
        makeScreen("c", "Screen 3"),
        makeScreen("d", "Screen 4"),
      ],
      2, // active = "c"
    );

    useMeasurementBuilderStore.getState().reorderScreens(2, 0);

    const { screens, activeScreenIndex } = useMeasurementBuilderStore.getState();
    expect(activeScreenIndex).toBe(0);
    expect(screens[activeScreenIndex].id).toBe("c");
  });

  it("adjusts activeScreenIndex when a screen to its left moves past it (rightward)", () => {
    seedScreens(
      [
        makeScreen("a", "Screen 1"),
        makeScreen("b", "Screen 2"),
        makeScreen("c", "Screen 3"),
        makeScreen("d", "Screen 4"),
      ],
      2, // active = "c" at index 2
    );

    // move "a" (idx 0) to index 3 — "c" shifts left by 1
    useMeasurementBuilderStore.getState().reorderScreens(0, 3);

    const { screens, activeScreenIndex } = useMeasurementBuilderStore.getState();
    expect(screens[activeScreenIndex].id).toBe("c");
    expect(activeScreenIndex).toBe(1);
  });

  it("adjusts activeScreenIndex when a screen to its right moves past it (leftward)", () => {
    seedScreens(
      [
        makeScreen("a", "Screen 1"),
        makeScreen("b", "Screen 2"),
        makeScreen("c", "Screen 3"),
        makeScreen("d", "Screen 4"),
      ],
      1, // active = "b" at index 1
    );

    // move "d" (idx 3) to index 0 — "b" shifts right by 1
    useMeasurementBuilderStore.getState().reorderScreens(3, 0);

    const { screens, activeScreenIndex } = useMeasurementBuilderStore.getState();
    expect(screens[activeScreenIndex].id).toBe("b");
    expect(activeScreenIndex).toBe(2);
  });

  it("leaves activeScreenIndex unchanged when a move does not cross it", () => {
    seedScreens(
      [
        makeScreen("a", "Screen 1"),
        makeScreen("b", "Screen 2"),
        makeScreen("c", "Screen 3"),
        makeScreen("d", "Screen 4"),
      ],
      3, // active = "d"
    );

    // swap "a" and "b" — both to the left of active
    useMeasurementBuilderStore.getState().reorderScreens(0, 1);

    const { screens, activeScreenIndex } = useMeasurementBuilderStore.getState();
    expect(activeScreenIndex).toBe(3);
    expect(screens[activeScreenIndex].id).toBe("d");
  });

  it("sets isDirty to true after a successful reorder", () => {
    seedScreens([
      makeScreen("a", "Screen 1"),
      makeScreen("b", "Screen 2"),
    ]);
    expect(useMeasurementBuilderStore.getState().isDirty).toBe(false);

    useMeasurementBuilderStore.getState().reorderScreens(0, 1);

    expect(useMeasurementBuilderStore.getState().isDirty).toBe(true);
  });

  it("preserves screen titles on reorder (no auto-rename of 'Screen N')", () => {
    seedScreens([
      makeScreen("a", "Screen 1"),
      makeScreen("b", "Screen 2"),
      makeScreen("c", "Screen 3"),
    ]);

    useMeasurementBuilderStore.getState().reorderScreens(2, 0);

    const titles = useMeasurementBuilderStore
      .getState()
      .screens.map((s) => s.title);
    // Titles follow their screens — "Screen 3" is now first, not renamed to "Screen 1"
    expect(titles).toEqual(["Screen 3", "Screen 1", "Screen 2"]);
  });

  it("no-ops when fromIndex === toIndex", () => {
    const initialScreens = [
      makeScreen("a", "Screen 1"),
      makeScreen("b", "Screen 2"),
    ];
    seedScreens(initialScreens, 1);

    useMeasurementBuilderStore.getState().reorderScreens(1, 1);

    const state = useMeasurementBuilderStore.getState();
    expect(state.screens.map((s) => s.id)).toEqual(["a", "b"]);
    expect(state.activeScreenIndex).toBe(1);
    expect(state.isDirty).toBe(false);
  });

  it("no-ops when indices are out of bounds", () => {
    const initialScreens = [
      makeScreen("a", "Screen 1"),
      makeScreen("b", "Screen 2"),
    ];
    seedScreens(initialScreens);

    useMeasurementBuilderStore.getState().reorderScreens(0, 5);

    const state = useMeasurementBuilderStore.getState();
    expect(state.screens.map((s) => s.id)).toEqual(["a", "b"]);
    expect(state.isDirty).toBe(false);
  });
});
