import { create } from "zustand";
import type {
  IQComponent,
  IQScreen,
  IMeasurement,
  DeviceSize,
} from "@/common/types/measurement";
import { createDefaultScreen } from "@/common/types/measurement";
import {
  insertComponent,
  removeComponentById,
  updateComponentById,
  moveComponent as moveComponentInTree,
} from "@/screens/measurements/lib/treeUtils";

interface MeasurementBuilderStore {
  measurements: IMeasurement[];
  activeMeasurementId: string | null;
  screens: IQScreen[];
  activeScreenIndex: number;
  selectedComponentId: string | null;
  isPreviewMode: boolean;
  previewDevice: DeviceSize;
  isDirty: boolean;

  addMeasurement: (q: IMeasurement) => void;
  updateMeasurement: (id: string, updates: Partial<IMeasurement>) => void;
  deleteMeasurement: (id: string) => void;
  duplicateMeasurement: (id: string) => void;
  loadMeasurement: (id: string) => void;
  hydrateScreens: (screens: IQScreen[]) => void;

  addScreen: () => void;
  removeScreen: (index: number) => void;
  setActiveScreen: (index: number) => void;
  renameScreen: (index: number, title: string) => void;

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

  setPreviewMode: (enabled: boolean) => void;
  setPreviewDevice: (device: DeviceSize) => void;

  saveCurrentMeasurement: () => void;
}

const EMPTY_COMPONENTS: IQComponent[] = [];

export function selectActiveScreenComponents(state: {
  screens: IQScreen[];
  activeScreenIndex: number;
}): IQComponent[] {
  return state.screens[state.activeScreenIndex]?.components ?? EMPTY_COMPONENTS;
}

export const useMeasurementBuilderStore = create<MeasurementBuilderStore>()(
  (set, get) => ({
    measurements: [],
    activeMeasurementId: null,
    screens: [createDefaultScreen()],
    activeScreenIndex: 0,
    selectedComponentId: null,
    isPreviewMode: false,
    previewDevice: "mobile",
    isDirty: false,

    addMeasurement: (q) =>
      set((state) => ({ measurements: [...state.measurements, q] })),

    updateMeasurement: (id, updates) =>
      set((state) => ({
        measurements: state.measurements.map((q) =>
          q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q,
        ),
      })),

    deleteMeasurement: (id) =>
      set((state) => ({
        measurements: state.measurements.filter((q) => q.id !== id),
      })),

    duplicateMeasurement: (id) => {
      const state = get();
      const original = state.measurements.find((q) => q.id === id);
      if (!original) return;

      const now = new Date().toISOString();
      const duplicate: IMeasurement = {
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
      set((s) => ({ measurements: [...s.measurements, duplicate] }));
    },

    loadMeasurement: (id) => {
      const q = get().measurements.find((q) => q.id === id);
      if (!q) return;
      const screens = q.screens?.length ? q.screens : [createDefaultScreen()];
      set({
        activeMeasurementId: id,
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

    saveCurrentMeasurement: () => {
      const state = get();
      if (!state.activeMeasurementId) return;
      const now = new Date().toISOString();
      set((s) => ({
        measurements: s.measurements.map((q) =>
          q.id === state.activeMeasurementId
            ? { ...q, screens: state.screens, updatedAt: now }
            : q,
        ),
        isDirty: false,
      }));
    },
  }),
);
