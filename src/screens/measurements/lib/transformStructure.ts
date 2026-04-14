import type {
  IQScreen,
  IQComponent,
  IQOptionItem,
  CorrectAnswerType,
} from "@/common/types/measurement";

const FRONTEND_TO_BACKEND_TYPE: Record<string, string> = {
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

const INPUT_TYPES = new Set(Object.keys(FRONTEND_TO_BACKEND_TYPE));

interface BackendField {
  label: string;
  field_type: string;
  required: boolean;
  row_number: number;
  order_in_row: number;
  config: Record<string, unknown>;
  correct_answer_type: CorrectAnswerType;
  correct_answer?: string;
  points?: number;
}

interface BackendScreen {
  title: string;
  order: number;
  fields: BackendField[];
}

export interface BackendStructurePayload {
  screens: BackendScreen[];
}

function isInputType(type: string): boolean {
  return INPUT_TYPES.has(type);
}

function buildConfig(component: IQComponent): Record<string, unknown> {
  switch (component.type) {
    case "dropdown":
    case "multiSelect":
      return {
        options: component.options.map((o: IQOptionItem) => o.value),
      };
    case "radioGroup":
      return {
        options: component.options.map((o: IQOptionItem) => o.value),
        layout: component.layout,
      };
    case "numberInput":
      return { min: component.min, max: component.max, step: component.step };
    case "scale":
      return { min: component.min, max: component.max, step: component.step };
    case "toggleSwitch":
      return {
        true_label: "true",
        false_label: "false",
        default_value: component.defaultValue,
      };
    default:
      return {};
  }
}

function mapComponent(
  component: IQComponent,
  rowNumber: number,
  orderInRow: number,
): BackendField | null {
  if (!isInputType(component.type)) return null;

  const answerType: CorrectAnswerType =
    (component as Record<string, unknown>).correctAnswerType as CorrectAnswerType ??
    "NONE";

  const field: BackendField = {
    label: component.label,
    field_type: FRONTEND_TO_BACKEND_TYPE[component.type],
    required: "required" in component ? (component as Record<string, unknown>).required as boolean : false,
    row_number: rowNumber,
    order_in_row: orderInRow,
    config: buildConfig(component),
    correct_answer_type: answerType,
  };

  if (answerType !== "NONE") {
    field.correct_answer =
      ((component as Record<string, unknown>).correctAnswer as string) ?? "";
    field.points =
      ((component as Record<string, unknown>).grade as number) ?? 0;
  }

  return field;
}

export function transformScreensToPayload(
  screens: IQScreen[],
): BackendStructurePayload {
  return {
    screens: screens.map((screen, screenIndex) => {
      const fields: BackendField[] = [];
      let rowNumber = 1;

      for (const component of screen.components) {
        if (component.type === "rowContainer") {
          let orderInRow = 1;
          for (const child of component.children) {
            const field = mapComponent(child, rowNumber, orderInRow);
            if (field) {
              fields.push(field);
              orderInRow++;
            }
          }
          rowNumber++;
        } else {
          const field = mapComponent(component, rowNumber, 1);
          if (field) {
            fields.push(field);
          }
          rowNumber++;
        }
      }

      return {
        title: screen.title,
        order: screenIndex + 1,
        fields,
      };
    }),
  };
}
