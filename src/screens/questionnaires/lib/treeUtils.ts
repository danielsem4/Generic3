import type { IQComponent, IQRowContainer } from "@/common/types/questionnaire";

export interface FindResult {
  component: IQComponent;
  parentArray: IQComponent[];
  index: number;
}

export function findComponentById(
  components: IQComponent[],
  id: string,
): FindResult | undefined {
  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    if (comp.id === id) {
      return { component: comp, parentArray: components, index: i };
    }
    if (comp.type === "rowContainer") {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function insertComponent(
  components: IQComponent[],
  component: IQComponent,
  index: number,
  parentId?: string,
): IQComponent[] {
  if (!parentId) {
    const result = [...components];
    result.splice(index, 0, component);
    return result;
  }

  return components.map((comp) => {
    if (comp.id === parentId && comp.type === "rowContainer") {
      const newChildren = [...comp.children];
      newChildren.splice(index, 0, component);
      return { ...comp, children: newChildren };
    }
    if (comp.type === "rowContainer") {
      return {
        ...comp,
        children: insertComponent(comp.children, component, index, parentId),
      };
    }
    return comp;
  });
}

export function removeComponentById(
  components: IQComponent[],
  id: string,
): IQComponent[] {
  const result: IQComponent[] = [];

  for (const comp of components) {
    if (comp.id === id) continue;

    if (comp.type === "rowContainer") {
      result.push({
        ...comp,
        children: removeComponentById(comp.children, id),
      } as IQRowContainer);
    } else {
      result.push(comp);
    }
  }

  return result;
}

export function updateComponentById(
  components: IQComponent[],
  id: string,
  updates: Partial<IQComponent>,
): IQComponent[] {
  return components.map((comp) => {
    if (comp.id === id) {
      return { ...comp, ...updates } as IQComponent;
    }
    if (comp.type === "rowContainer") {
      return {
        ...comp,
        children: updateComponentById(comp.children, id, updates),
      } as IQRowContainer;
    }
    return comp;
  });
}

export function moveComponent(
  components: IQComponent[],
  fromId: string,
  toIndex: number,
  toParentId?: string,
): IQComponent[] {
  const found = findComponentById(components, fromId);
  if (!found) return components;

  const withoutSource = removeComponentById(components, fromId);
  return insertComponent(withoutSource, found.component, toIndex, toParentId);
}
