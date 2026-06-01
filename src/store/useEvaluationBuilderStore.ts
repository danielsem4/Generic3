import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  IQComponent,
  IQScreen,
  IEvaluation,
  DeviceSize,
} from "@/common/types/evaluation";
import { createDefaultScreen } from "@/common/types/evaluation";
import {
  insertComponent,
  removeComponentById,
  updateComponentById,
  moveComponent as moveComponentInTree,
  transformComponentById,
} from "@/screens/evaluations/lib/treeUtils";
import {
  branchNewVersion,
  switchActiveVersion,
  deleteVersion,
  switchToVersionByLabel,
} from "@/screens/evaluations/lib/versionUtils";

interface EvaluationBuilderStore {
  evaluations: IEvaluation[];
  activeEvaluationId: string | null;
  screens: IQScreen[];
  activeScreenIndex: number;
  selectedComponentId: string | null;
  isPreviewMode: boolean;
  previewDevice: DeviceSize;
  isDirty: boolean;

  addEvaluation: (q: IEvaluation) => void;
  updateEvaluation: (id: string, updates: Partial<IEvaluation>) => void;
  deleteEvaluation: (id: string) => void;
  duplicateEvaluation: (id: string) => void;
  loadEvaluation: (id: string) => void;
  hydrateScreens: (screens: IQScreen[]) => void;

  addScreen: () => void;
  removeScreen: (index: number) => void;
  setActiveScreen: (index: number) => void;
  renameScreen: (index: number, title: string) => void;
  reorderScreens: (fromIndex: number, toIndex: number) => void;

  addComponent: (component: IQComponent, index: number) => void;
  addComponentToRow: (
    component: IQComponent,
    rowId: string,
    index: number,
  ) => void;
  removeComponent: (id: string) => void;
  moveComponent: (fromId: string, toIndex: number, toParentId?: string) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProps: (id: string, updates: Partial<IQComponent>) => void;
  clearCanvas: () => void;

  branchComponentVersion: (componentId: string) => void;
  switchComponentVersion: (componentId: string, versionId: string) => void;
  deleteComponentVersion: (componentId: string, versionId: string) => void;
  switchAllComponentsVersion: (versionLabel: string) => void;

  setPreviewMode: (enabled: boolean) => void;
  setPreviewDevice: (device: DeviceSize) => void;

  saveCurrentEvaluation: () => void;
}

const EMPTY_COMPONENTS: IQComponent[] = [];

export function selectActiveScreenComponents(state: {
  screens: IQScreen[];
  activeScreenIndex: number;
}): IQComponent[] {
  return state.screens[state.activeScreenIndex]?.components ?? EMPTY_COMPONENTS;
}

export const useEvaluationBuilderStore = create<EvaluationBuilderStore>()(
  (set, get) => ({
    evaluations: [],
    activeEvaluationId: null,
    screens: [createDefaultScreen()],
    activeScreenIndex: 0,
    selectedComponentId: null,
    isPreviewMode: false,
    previewDevice: "mobile",
    isDirty: false,

    addEvaluation: (q) =>
      set((state) => ({ evaluations: [...state.evaluations, q] })),

    updateEvaluation: (id, updates) =>
      set((state) => ({
        evaluations: state.evaluations.map((q) =>
          q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q,
        ),
      })),

    deleteEvaluation: (id) =>
      set((state) => ({
        evaluations: state.evaluations.filter((q) => q.id !== id),
      })),

    duplicateEvaluation: (id) => {
      const state = get();
      const original = state.evaluations.find((q) => q.id === id);
      if (!original) return;

      const now = new Date().toISOString();
      const duplicate: IEvaluation = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name} (Copy)`,
        screens: original.screens.map((screen) => ({
          ...screen,
          id: crypto.randomUUID(),
          components: [...screen.components],
        })),
        createdAt: now,
        updatedAt: now,
      };
      set((s) => ({ evaluations: [...s.evaluations, duplicate] }));
    },

    loadEvaluation: (id) => {
      const q = get().evaluations.find((q) => q.id === id);
      if (!q) return;
      const screens = q.screens?.length ? q.screens : [createDefaultScreen()];
      set({
        activeEvaluationId: id,
        screens,
        activeScreenIndex: 0,
        selectedComponentId: null,
        isPreviewMode: false,
        isDirty: false,
      });
    },

    hydrateScreens: (screens) =>
      set({
        screens: screens.length ? screens : [createDefaultScreen()],
        activeScreenIndex: 0,
        selectedComponentId: null,
        isPreviewMode: false,
        isDirty: false,
      }),

    addScreen: () =>
      set((state) => {
        const newScreen = createDefaultScreen(
          `Screen ${state.screens.length + 1}`,
        );
        return {
          screens: [...state.screens, newScreen],
          activeScreenIndex: state.screens.length,
          selectedComponentId: null,
          isDirty: true,
        };
      }),

    removeScreen: (index) =>
      set((state) => {
        if (state.screens.length <= 1) return state;
        const newScreens = state.screens
          .filter((_, i) => i !== index)
          .map((screen, i) => {
            if (/^Screen \d+$/.test(screen.title)) {
              return { ...screen, title: `Screen ${i + 1}` };
            }
            return screen;
          });
        const newIndex =
          state.activeScreenIndex >= newScreens.length
            ? newScreens.length - 1
            : state.activeScreenIndex > index
              ? state.activeScreenIndex - 1
              : state.activeScreenIndex;
        return {
          screens: newScreens,
          activeScreenIndex: newIndex,
          selectedComponentId: null,
          isDirty: true,
        };
      }),

    setActiveScreen: (index) =>
      set({ activeScreenIndex: index, selectedComponentId: null }),

    renameScreen: (index, title) =>
      set((state) => {
        const newScreens = [...state.screens];
        newScreens[index] = { ...newScreens[index], title };
        return { screens: newScreens, isDirty: true };
      }),

    reorderScreens: (fromIndex, toIndex) =>
      set((state) => {
        if (fromIndex === toIndex) return state;
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= state.screens.length ||
          toIndex >= state.screens.length
        ) {
          return state;
        }

        const newScreens = arrayMove(state.screens, fromIndex, toIndex);

        const active = state.activeScreenIndex;
        let newActive = active;
        if (active === fromIndex) {
          newActive = toIndex;
        } else if (fromIndex < active && active <= toIndex) {
          newActive = active - 1;
        } else if (toIndex <= active && active < fromIndex) {
          newActive = active + 1;
        }

        return {
          screens: newScreens,
          activeScreenIndex: newActive,
          isDirty: true,
        };
      }),

    addComponent: (component, index) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = insertComponent(screen.components, component, index);
        newScreens[state.activeScreenIndex] = screen;
        return { screens: newScreens, isDirty: true };
      }),

    addComponentToRow: (component, rowId, index) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = insertComponent(
          screen.components,
          component,
          index,
          rowId,
        );
        newScreens[state.activeScreenIndex] = screen;
        return { screens: newScreens, isDirty: true };
      }),

    removeComponent: (id) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = removeComponentById(screen.components, id);
        newScreens[state.activeScreenIndex] = screen;
        return {
          screens: newScreens,
          selectedComponentId:
            state.selectedComponentId === id ? null : state.selectedComponentId,
          isDirty: true,
        };
      }),

    moveComponent: (fromId, toIndex, toParentId) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = moveComponentInTree(
          screen.components,
          fromId,
          toIndex,
          toParentId,
        );
        newScreens[state.activeScreenIndex] = screen;
        return { screens: newScreens, isDirty: true };
      }),

    selectComponent: (id) => set({ selectedComponentId: id }),

    updateComponentProps: (id, updates) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = updateComponentById(screen.components, id, updates);
        newScreens[state.activeScreenIndex] = screen;
        return { screens: newScreens, isDirty: true };
      }),

    branchComponentVersion: (componentId) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = transformComponentById(
          screen.components,
          componentId,
          branchNewVersion,
        );
        newScreens[state.activeScreenIndex] = screen;
        return { screens: newScreens, isDirty: true };
      }),

    switchComponentVersion: (componentId, versionId) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = transformComponentById(
          screen.components,
          componentId,
          (comp) => switchActiveVersion(comp, versionId),
        );
        newScreens[state.activeScreenIndex] = screen;
        return { screens: newScreens, isDirty: true };
      }),

    deleteComponentVersion: (componentId, versionId) =>
      set((state) => {
        const newScreens = [...state.screens];
        const screen = { ...newScreens[state.activeScreenIndex] };
        screen.components = transformComponentById(
          screen.components,
          componentId,
          (comp) => deleteVersion(comp, versionId),
        );
        newScreens[state.activeScreenIndex] = screen;
        return { screens: newScreens, isDirty: true };
      }),

    switchAllComponentsVersion: (versionLabel) =>
      set((state) => {
        function switchAll(components: IQComponent[]): IQComponent[] {
          return components.map((comp) => {
            const switched = switchToVersionByLabel(comp, versionLabel);
            if (switched.type === "rowContainer") {
              return { ...switched, children: switchAll(switched.children) } as IQComponent;
            }
            return switched;
          });
        }

        const newScreens = state.screens.map((screen) => ({
          ...screen,
          components: switchAll(screen.components),
        }));
        return { screens: newScreens, isDirty: true };
      }),

    clearCanvas: () =>
      set((state) => {
        const newScreens = [...state.screens];
        newScreens[state.activeScreenIndex] = {
          ...newScreens[state.activeScreenIndex],
          components: [],
        };
        return { screens: newScreens, selectedComponentId: null, isDirty: true };
      }),

    setPreviewMode: (enabled) =>
      set({ isPreviewMode: enabled, selectedComponentId: null }),

    setPreviewDevice: (device) => set({ previewDevice: device }),

    saveCurrentEvaluation: () => {
      const state = get();
      if (!state.activeEvaluationId) return;
      const now = new Date().toISOString();
      set((s) => ({
        evaluations: s.evaluations.map((q) =>
          q.id === state.activeEvaluationId
            ? { ...q, screens: state.screens, updatedAt: now }
            : q,
        ),
        isDirty: false,
      }));
    },
  }),
);
