import { describe, it, expect } from "vitest";
import type { IQComponent } from "@/common/types/measurement";
import {
  findComponentById,
  insertComponent,
  removeComponentById,
  updateComponentById,
  moveComponent,
} from "./treeUtils";

function makeHeading(id: string, text = "Test"): IQComponent {
  return { id, type: "heading", label: "Heading", text, level: 1 };
}

function makeRow(id: string, children: IQComponent[] = []): IQComponent {
  return { id, type: "rowContainer", label: "Row", children };
}

describe("findComponentById", () => {
  it("finds a top-level component", () => {
    const components = [makeHeading("h1"), makeHeading("h2")];
    const result = findComponentById(components, "h1");
    expect(result).toBeDefined();
    expect(result!.component.id).toBe("h1");
    expect(result!.index).toBe(0);
  });

  it("finds a nested component inside a row", () => {
    const child = makeHeading("nested");
    const components = [makeRow("row1", [child])];
    const result = findComponentById(components, "nested");
    expect(result).toBeDefined();
    expect(result!.component.id).toBe("nested");
    expect(result!.index).toBe(0);
  });

  it("returns undefined for missing id", () => {
    const components = [makeHeading("h1")];
    expect(findComponentById(components, "missing")).toBeUndefined();
  });
});

describe("insertComponent", () => {
  it("inserts at the top level", () => {
    const components = [makeHeading("h1")];
    const newComp = makeHeading("h2");
    const result = insertComponent(components, newComp, 0);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("h2");
  });

  it("inserts into a row container", () => {
    const components = [makeRow("row1", [makeHeading("h1")])];
    const newComp = makeHeading("h2");
    const result = insertComponent(components, newComp, 1, "row1");
    const row = result[0] as Extract<IQComponent, { type: "rowContainer" }>;
    expect(row.children).toHaveLength(2);
    expect(row.children[1].id).toBe("h2");
  });

  it("inserts at a specific index", () => {
    const components = [makeHeading("h1"), makeHeading("h3")];
    const newComp = makeHeading("h2");
    const result = insertComponent(components, newComp, 1);
    expect(result[1].id).toBe("h2");
    expect(result).toHaveLength(3);
  });
});

describe("removeComponentById", () => {
  it("removes a top-level component", () => {
    const components = [makeHeading("h1"), makeHeading("h2")];
    const result = removeComponentById(components, "h1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("h2");
  });

  it("removes a nested component", () => {
    const components = [makeRow("row1", [makeHeading("h1"), makeHeading("h2")])];
    const result = removeComponentById(components, "h1");
    const row = result[0] as Extract<IQComponent, { type: "rowContainer" }>;
    expect(row.children).toHaveLength(1);
    expect(row.children[0].id).toBe("h2");
  });

  it("returns same structure if id not found", () => {
    const components = [makeHeading("h1")];
    const result = removeComponentById(components, "missing");
    expect(result).toHaveLength(1);
  });
});

describe("updateComponentById", () => {
  it("updates a top-level component", () => {
    const components = [makeHeading("h1", "Old")];
    const result = updateComponentById(components, "h1", { text: "New" });
    expect((result[0] as Extract<IQComponent, { type: "heading" }>).text).toBe("New");
  });

  it("updates a nested component", () => {
    const components = [makeRow("row1", [makeHeading("h1", "Old")])];
    const result = updateComponentById(components, "h1", { text: "New" });
    const row = result[0] as Extract<IQComponent, { type: "rowContainer" }>;
    expect((row.children[0] as Extract<IQComponent, { type: "heading" }>).text).toBe("New");
  });

  it("does not modify other components", () => {
    const components = [makeHeading("h1", "Keep"), makeHeading("h2", "Old")];
    const result = updateComponentById(components, "h2", { text: "New" });
    expect((result[0] as Extract<IQComponent, { type: "heading" }>).text).toBe("Keep");
  });
});

describe("moveComponent", () => {
  it("moves a component within the top level", () => {
    const components = [makeHeading("h1"), makeHeading("h2"), makeHeading("h3")];
    const result = moveComponent(components, "h3", 0);
    expect(result[0].id).toBe("h3");
    expect(result[1].id).toBe("h1");
    expect(result[2].id).toBe("h2");
  });

  it("moves a component into a row", () => {
    const components = [makeHeading("h1"), makeRow("row1", [])];
    const result = moveComponent(components, "h1", 0, "row1");
    expect(result).toHaveLength(1);
    const row = result[0] as Extract<IQComponent, { type: "rowContainer" }>;
    expect(row.children).toHaveLength(1);
    expect(row.children[0].id).toBe("h1");
  });

  it("returns unchanged array if source not found", () => {
    const components = [makeHeading("h1")];
    const result = moveComponent(components, "missing", 0);
    expect(result).toHaveLength(1);
  });
});
