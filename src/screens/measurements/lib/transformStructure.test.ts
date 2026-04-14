import { describe, it, expect } from "vitest";
import { transformScreensToPayload } from "./transformStructure";
import type { IQScreen } from "@/common/types/measurement";

describe("transformScreensToPayload", () => {
  it("returns empty screens array for empty input", () => {
    const result = transformScreensToPayload([]);
    expect(result).toEqual({ screens: [] });
  });

  it("skips non-input components", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          { id: "c1", type: "heading", label: "Title", text: "Hello", level: 1 },
          { id: "c2", type: "paragraph", label: "Para", text: "Some text" },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    expect(result.screens[0].fields).toEqual([]);
  });

  it("maps a textInput with NONE answer type", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "textInput",
            label: "Name",
            placeholder: "Enter name",
            required: true,
            correctAnswerType: "NONE",
            correctAnswer: "",
            grade: 0,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    const field = result.screens[0].fields[0];
    expect(field.field_type).toBe("INPUT_TEXT");
    expect(field.label).toBe("Name");
    expect(field.required).toBe(true);
    expect(field.row_number).toBe(1);
    expect(field.order_in_row).toBe(1);
    expect(field.correct_answer_type).toBe("NONE");
    expect(field.correct_answer).toBeUndefined();
    expect(field.points).toBeUndefined();
  });

  it("maps a dropdown with STATIC answer type", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "dropdown",
            label: "Color",
            placeholder: "Pick",
            required: false,
            options: [
              { label: "Red", value: "red" },
              { label: "Blue", value: "blue" },
            ],
            correctAnswerType: "STATIC",
            correctAnswer: "red",
            grade: 5,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    const field = result.screens[0].fields[0];
    expect(field.field_type).toBe("INPUT_SELECT");
    expect(field.config).toEqual({ options: ["red", "blue"] });
    expect(field.correct_answer_type).toBe("STATIC");
    expect(field.correct_answer).toBe("red");
    expect(field.points).toBe(5);
  });

  it("maps a numberInput with config", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "numberInput",
            label: "Age",
            placeholder: "Enter age",
            required: true,
            min: 0,
            max: 120,
            step: 1,
            correctAnswerType: "DYNAMIC",
            correctAnswer: "CURRENT_YEAR",
            grade: 10,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    const field = result.screens[0].fields[0];
    expect(field.field_type).toBe("INPUT_NUMBER");
    expect(field.config).toEqual({ min: 0, max: 120, step: 1 });
    expect(field.correct_answer).toBe("CURRENT_YEAR");
    expect(field.points).toBe(10);
  });

  it("flattens rowContainer children with same row_number", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "textInput",
            label: "Solo",
            placeholder: "",
            required: false,
            correctAnswerType: "NONE",
            correctAnswer: "",
            grade: 0,
          },
          {
            id: "row1",
            type: "rowContainer",
            label: "Row",
            children: [
              {
                id: "c2",
                type: "textInput",
                label: "First",
                placeholder: "",
                required: false,
                correctAnswerType: "NONE",
                correctAnswer: "",
                grade: 0,
              },
              {
                id: "c3",
                type: "numberInput",
                label: "Second",
                placeholder: "",
                required: false,
                min: 0,
                max: 10,
                step: 1,
                correctAnswerType: "NONE",
                correctAnswer: "",
                grade: 0,
              },
            ],
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    const fields = result.screens[0].fields;
    expect(fields).toHaveLength(3);
    expect(fields[0].row_number).toBe(1);
    expect(fields[0].order_in_row).toBe(1);
    expect(fields[1].row_number).toBe(2);
    expect(fields[1].order_in_row).toBe(1);
    expect(fields[2].row_number).toBe(2);
    expect(fields[2].order_in_row).toBe(2);
  });

  it("maps all backend field types correctly", () => {
    const typeMap: Record<string, string> = {
      textInput: "INPUT_TEXT",
      numberInput: "INPUT_NUMBER",
      dropdown: "INPUT_SELECT",
      multiSelect: "INPUT_MULTI_SELECT",
      radioGroup: "INPUT_RADIO",
      datePicker: "INPUT_DATE",
      timePicker: "INPUT_TIME",
      scale: "INPUT_SCALE",
      toggleSwitch: "INPUT_BOOLEAN",
    };

    for (const [frontend, backend] of Object.entries(typeMap)) {
      const component: Record<string, unknown> = {
        id: "c1",
        type: frontend,
        label: "Test",
        placeholder: "",
        required: false,
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      };

      if (frontend === "numberInput" || frontend === "scale") {
        component.min = 0;
        component.max = 10;
        component.step = 1;
      }
      if (
        frontend === "dropdown" ||
        frontend === "multiSelect" ||
        frontend === "radioGroup"
      ) {
        component.options = [];
      }
      if (frontend === "radioGroup") {
        component.layout = "vertical";
      }
      if (frontend === "toggleSwitch") {
        component.defaultValue = false;
      }

      const screens = [
        { id: "s1", title: "S1", components: [component] },
      ] as IQScreen[];
      const result = transformScreensToPayload(screens);
      expect(result.screens[0].fields[0].field_type).toBe(backend);
    }
  });

  it("sets screen order starting from 1", () => {
    const screens: IQScreen[] = [
      { id: "s1", title: "First", components: [] },
      { id: "s2", title: "Second", components: [] },
      { id: "s3", title: "Third", components: [] },
    ];
    const result = transformScreensToPayload(screens);
    expect(result.screens.map((s) => s.order)).toEqual([1, 2, 3]);
    expect(result.screens.map((s) => s.title)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
  });

  it("maps toggleSwitch config correctly", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "toggleSwitch",
            label: "Agree",
            defaultValue: true,
            correctAnswerType: "NONE",
            correctAnswer: "",
            grade: 0,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    expect(result.screens[0].fields[0].config).toEqual({
      true_label: "true",
      false_label: "false",
      default_value: true,
    });
  });
});
