import { describe, it, expect } from "vitest";
import { transformScreensToPayload } from "./transformStructure";
import type { IQScreen } from "@/common/types/measurement";

describe("transformScreensToPayload", () => {
  it("returns empty screens array for empty input", () => {
    const result = transformScreensToPayload([]);
    expect(result).toEqual({ screens: [] });
  });

  it("maps display components to their backend types", () => {
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
    expect(result.screens[0].elements).toHaveLength(2);
    expect(result.screens[0].elements[0].element_type).toBe("HEADER");
    expect(result.screens[0].elements[1].element_type).toBe("PARAGRAPH");
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
    const element = result.screens[0].elements[0];
    expect(element.element_type).toBe("INPUT_TEXT");
    expect(element.label).toBe("Name");
    expect(element.is_required).toBe(true);
    expect(element.row_number).toBe(1);
    expect(element.order_in_row).toBe(1);
    expect(element.correct_answer_type).toBe("NONE");
    expect(element.correct_answers).toBeUndefined();
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
              { label: "Red", value: "red", isCorrect: true, score: 5 },
              { label: "Blue", value: "blue" },
            ],
            correctAnswerType: "STATIC",
            correctAnswer: "Red",
            grade: 5,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    const element = result.screens[0].elements[0];
    expect(element.element_type).toBe("INPUT_SELECT");
    expect(element.config).toEqual({ options: ["Red", "Blue"] });
    expect(element.correct_answer_type).toBe("STATIC");
    expect(element.correct_answers?.[0].answer).toBe("Red");
    expect(element.correct_answers?.[0].points).toBe(5);
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
    const element = result.screens[0].elements[0];
    expect(element.element_type).toBe("INPUT_NUMBER");
    expect(element.config).toEqual({ min: 0, max: 120, step: 1 });
    expect(element.correct_answers?.[0].answer).toBe("CURRENT_YEAR");
    expect(element.correct_answers?.[0].points).toBe(10);
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
    const elements = result.screens[0].elements;
    expect(elements).toHaveLength(3);
    expect(elements[0].row_number).toBe(1);
    expect(elements[0].order_in_row).toBe(1);
    expect(elements[1].row_number).toBe(2);
    expect(elements[1].order_in_row).toBe(1);
    expect(elements[2].row_number).toBe(2);
    expect(elements[2].order_in_row).toBe(2);
  });

  it("maps all backend element types correctly", () => {
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
      expect(result.screens[0].elements[0].element_type).toBe(backend);
    }
  });

  it("preserves screen titles in order", () => {
    const screens: IQScreen[] = [
      { id: "s1", title: "First", components: [] },
      { id: "s2", title: "Second", components: [] },
      { id: "s3", title: "Third", components: [] },
    ];
    const result = transformScreensToPayload(screens);
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
    expect(result.screens[0].elements[0].config).toEqual({
      true_label: "Yes",
      false_label: "No",
      default_value: true,
    });
  });
});
