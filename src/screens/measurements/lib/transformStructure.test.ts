import { describe, it, expect } from "vitest";
import {
  transformScreensToPayload,
  transformPayloadToScreens,
  type IServerStructureResponse,
} from "./transformStructure";
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
    expect(element.config).toEqual({ placeholder: "Pick", options: ["Red", "Blue"] });
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
    expect(element.config).toEqual({ placeholder: "Enter age", min: 0, max: 120, step: 1 });
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
      cardRadioGroup: "INPUT_RADIO",
      cardMultiSelect: "INPUT_MULTI_SELECT",
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
        frontend === "radioGroup" ||
        frontend === "cardRadioGroup" ||
        frontend === "cardMultiSelect"
      ) {
        component.options = [];
      }
      if (
        frontend === "radioGroup" ||
        frontend === "cardRadioGroup" ||
        frontend === "cardMultiSelect"
      ) {
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

  it("round-trips cardRadioGroup with display_style=cards", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "cardRadioGroup",
            label: "Feeling",
            required: false,
            options: [
              { label: "Good", value: "good" },
              { label: "Bad", value: "bad" },
            ],
            layout: "horizontal",
            correctAnswerType: "NONE",
            correctAnswer: "",
            grade: 0,
          },
        ],
      },
    ];
    const payload = transformScreensToPayload(screens);
    const element = payload.screens[0].elements[0];
    expect(element.element_type).toBe("INPUT_RADIO");
    expect(element.config.display_style).toBe("cards");
    expect(element.config.layout).toBe("horizontal");

    const serverResponse: IServerStructureResponse = {
      measurement_id: "m1",
      measurement_name: "Test",
      screens: [
        {
          id: "s1",
          screen_number: 1,
          title: "Screen 1",
          rows: [
            {
              row_number: 1,
              elements: [
                {
                  id: "c1",
                  element_type: element.element_type,
                  row_number: element.row_number,
                  order_in_row: element.order_in_row,
                  label: element.label,
                  is_required: element.is_required,
                  config: element.config,
                  correct_answer_type: element.correct_answer_type,
                  correct_answers: element.correct_answers,
                },
              ],
            },
          ],
        },
      ],
    };
    const roundTripped = transformPayloadToScreens(serverResponse);
    const component = roundTripped[0].components[0];
    expect(component.type).toBe("cardRadioGroup");
    expect((component as { layout: string }).layout).toBe("horizontal");
  });

  it("round-trips cardMultiSelect with display_style=cards", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "cardMultiSelect",
            label: "Symptoms",
            required: true,
            options: [
              { label: "Cough", value: "cough" },
              { label: "Fever", value: "fever" },
            ],
            layout: "vertical",
            correctAnswerType: "NONE",
            correctAnswer: "",
            grade: 0,
          },
        ],
      },
    ];
    const payload = transformScreensToPayload(screens);
    const element = payload.screens[0].elements[0];
    expect(element.element_type).toBe("INPUT_MULTI_SELECT");
    expect(element.config.display_style).toBe("cards");

    const serverResponse: IServerStructureResponse = {
      measurement_id: "m1",
      measurement_name: "Test",
      screens: [
        {
          id: "s1",
          screen_number: 1,
          title: "Screen 1",
          rows: [
            {
              row_number: 1,
              elements: [
                {
                  id: "c1",
                  element_type: element.element_type,
                  row_number: element.row_number,
                  order_in_row: element.order_in_row,
                  label: element.label,
                  is_required: element.is_required,
                  config: element.config,
                  correct_answer_type: element.correct_answer_type,
                  correct_answers: element.correct_answers,
                },
              ],
            },
          ],
        },
      ],
    };
    const roundTripped = transformPayloadToScreens(serverResponse);
    const component = roundTripped[0].components[0];
    expect(component.type).toBe("cardMultiSelect");
    expect((component as { layout: string }).layout).toBe("vertical");
    expect("placeholder" in component).toBe(false);
  });

  it("preserves back-compat: plain radioGroup/multiSelect without display_style stay plain", () => {
    const serverResponse: IServerStructureResponse = {
      measurement_id: "m1",
      measurement_name: "Legacy",
      screens: [
        {
          id: "s1",
          screen_number: 1,
          title: "Legacy Screen",
          rows: [
            {
              row_number: 1,
              elements: [
                {
                  id: "e1",
                  element_type: "INPUT_RADIO",
                  row_number: 1,
                  order_in_row: 1,
                  label: "Color",
                  is_required: false,
                  config: {
                    options: ["Red", "Blue"],
                    layout: "vertical",
                  },
                  correct_answer_type: "NONE",
                },
              ],
            },
            {
              row_number: 2,
              elements: [
                {
                  id: "e2",
                  element_type: "INPUT_MULTI_SELECT",
                  row_number: 2,
                  order_in_row: 1,
                  label: "Tags",
                  is_required: false,
                  config: {
                    options: ["A", "B"],
                    placeholder: "Select...",
                  },
                  correct_answer_type: "NONE",
                },
              ],
            },
          ],
        },
      ],
    };
    const screens = transformPayloadToScreens(serverResponse);
    expect(screens[0].components[0].type).toBe("radioGroup");
    expect(screens[0].components[1].type).toBe("multiSelect");
  });

  it("includes allow_partial_score for multiSelect with STATIC answers", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "multiSelect",
            label: "Symptoms",
            placeholder: "Select...",
            required: false,
            options: [
              { label: "Option A", value: "option_a", isCorrect: true, score: 5 },
              { label: "Option B", value: "option_b", isCorrect: true, score: 5 },
            ],
            correctAnswerType: "STATIC",
            correctAnswer: "option_a,option_b",
            grade: 10,
            allowPartialScore: true,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    const element = result.screens[0].elements[0];
    expect(element.element_type).toBe("INPUT_MULTI_SELECT");
    expect(element.allow_partial_score).toBe(true);
    expect(element.correct_answers).toEqual([
      { answer: "Option A", points: 5 },
      { answer: "Option B", points: 5 },
    ]);
  });

  it("sets allow_partial_score false for multiSelect when explicitly false", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "multiSelect",
            label: "Symptoms",
            placeholder: "Select...",
            required: false,
            options: [
              { label: "Option A", value: "option_a", isCorrect: true, score: 5 },
              { label: "Option B", value: "option_b", isCorrect: true, score: 5 },
            ],
            correctAnswerType: "STATIC",
            correctAnswer: "option_a,option_b",
            grade: 10,
            allowPartialScore: false,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    expect(result.screens[0].elements[0].allow_partial_score).toBe(false);
  });

  it("does not include allow_partial_score for multiSelect with NONE answer type", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "multiSelect",
            label: "Tags",
            placeholder: "Select...",
            required: false,
            options: [{ label: "A", value: "a" }],
            correctAnswerType: "NONE",
            correctAnswer: "",
            grade: 0,
            allowPartialScore: false,
          },
        ],
      },
    ];
    const result = transformScreensToPayload(screens);
    expect(result.screens[0].elements[0].allow_partial_score).toBeUndefined();
  });

  it("round-trips cardMultiSelect with allow_partial_score", () => {
    const screens: IQScreen[] = [
      {
        id: "s1",
        title: "Screen 1",
        components: [
          {
            id: "c1",
            type: "cardMultiSelect",
            label: "Symptoms",
            required: true,
            options: [
              { label: "Cough", value: "cough", isCorrect: true, score: 3 },
              { label: "Fever", value: "fever", isCorrect: true, score: 7 },
            ],
            layout: "vertical",
            correctAnswerType: "STATIC",
            correctAnswer: "cough,fever",
            grade: 10,
            allowPartialScore: true,
          },
        ],
      },
    ];
    const payload = transformScreensToPayload(screens);
    const element = payload.screens[0].elements[0];
    expect(element.allow_partial_score).toBe(true);

    const serverResponse: IServerStructureResponse = {
      measurement_id: "m1",
      measurement_name: "Test",
      screens: [
        {
          id: "s1",
          screen_number: 1,
          title: "Screen 1",
          rows: [
            {
              row_number: 1,
              elements: [
                {
                  id: "c1",
                  element_type: element.element_type,
                  row_number: element.row_number,
                  order_in_row: element.order_in_row,
                  label: element.label,
                  is_required: element.is_required,
                  config: element.config,
                  correct_answer_type: element.correct_answer_type,
                  correct_answers: element.correct_answers,
                  allow_partial_score: element.allow_partial_score,
                },
              ],
            },
          ],
        },
      ],
    };
    const roundTripped = transformPayloadToScreens(serverResponse);
    const component = roundTripped[0].components[0];
    expect(component.type).toBe("cardMultiSelect");
    expect((component as { allowPartialScore: boolean }).allowPartialScore).toBe(true);
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
