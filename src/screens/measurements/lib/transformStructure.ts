import type {
  IQScreen,
  IQComponent,
  IQOptionItem,
  CorrectAnswerType,
} from "@/common/types/measurement";
import { isOptionBasedComponent } from "@/common/types/measurement";

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
  heading: "HEADER",
  paragraph: "PARAGRAPH",
  infoCard: "INFO_CARD",
  image: "IMAGE",
  icon: "ICON",
  button: "BUTTON",
};

interface CorrectAnswerEntry {
  answer: string;
  points: number;
}

interface BackendField {
  label: string;
  element_type: string;
  is_required: boolean;
  row_number: number;
  order_in_row: number;
  config: Record<string, unknown>;
  correct_answer_type: CorrectAnswerType;
  correct_answers?: CorrectAnswerEntry[];
}

interface BackendScreen {
  title: string;
  elements: BackendField[];
}

export interface BackendStructurePayload {
  screens: BackendScreen[];
}

function buildConfig(component: IQComponent): Record<string, unknown> {
  switch (component.type) {
    case "textInput":
      return { placeholder: component.placeholder };
    case "datePicker":
    case "timePicker":
      return { placeholder: component.placeholder };
    case "dropdown":
    case "multiSelect":
      return {
        options: component.options.map((o: IQOptionItem) => o.label),
      };
    case "radioGroup":
      return {
        options: component.options.map((o: IQOptionItem) => o.label),
        layout: component.layout,
      };
    case "numberInput":
      return { min: component.min, max: component.max, step: component.step };
    case "scale":
      return {
        min: component.min,
        max: component.max,
        step: component.step,
        min_label: component.minLabel ?? "",
        max_label: component.maxLabel ?? "",
      };
    case "toggleSwitch":
      return {
        true_label: component.trueLabel ?? "Yes",
        false_label: component.falseLabel ?? "No",
        default_value: component.defaultValue,
      };
    default:
      return {};
  }
}

function buildCorrectAnswers(
  component: IQComponent,
  answerType: CorrectAnswerType,
): CorrectAnswerEntry[] | undefined {
  if (answerType === "NONE") return undefined;

  if (isOptionBasedComponent(component.type) && answerType === "STATIC") {
    const options = (component as { options: IQOptionItem[] }).options;
    const entries = options
      .filter((o) => o.isCorrect)
      .map((o) => ({ answer: o.label, points: o.score ?? 0 }));
    return entries.length > 0 ? entries : undefined;
  }

  const correctAnswer =
    ((component as unknown as Record<string, unknown>).correctAnswer as string) ?? "";
  const grade =
    ((component as unknown as Record<string, unknown>).grade as number) ?? 0;
  return [{ answer: correctAnswer, points: grade }];
}

function getDisplayLabel(component: IQComponent): string {
  if ("text" in component && typeof component.text === "string") {
    return component.text;
  }
  return component.label;
}

function mapComponent(
  component: IQComponent,
  rowNumber: number,
  orderInRow: number,
): BackendField | null {
  const backendType = FRONTEND_TO_BACKEND_TYPE[component.type];
  if (!backendType) return null;

  const isDisplay = ["heading", "paragraph", "infoCard", "image", "icon", "button"].includes(
    component.type,
  );

  const answerType: CorrectAnswerType = isDisplay
    ? "NONE"
    : ((component as unknown as Record<string, unknown>).correctAnswerType as CorrectAnswerType) ?? "NONE";

  const field: BackendField = {
    label: isDisplay ? getDisplayLabel(component) : component.label,
    element_type: backendType,
    is_required: "required" in component
      ? ((component as unknown as Record<string, unknown>).required as boolean)
      : false,
    row_number: rowNumber,
    order_in_row: orderInRow,
    config: buildConfig(component),
    correct_answer_type: answerType,
  };

  const correctAnswers = buildCorrectAnswers(component, answerType);
  if (correctAnswers) {
    field.correct_answers = correctAnswers;
  }

  return field;
}

export function transformScreensToPayload(
  screens: IQScreen[],
): BackendStructurePayload {
  return {
    screens: screens.map((screen) => {
      const elements: BackendField[] = [];
      let rowNumber = 1;

      for (const component of screen.components) {
        if (component.type === "rowContainer") {
          let orderInRow = 1;
          for (const child of component.children) {
            const field = mapComponent(child, rowNumber, orderInRow);
            if (field) {
              elements.push(field);
              orderInRow++;
            }
          }
          rowNumber++;
        } else {
          const field = mapComponent(component, rowNumber, 1);
          if (field) {
            elements.push(field);
          }
          rowNumber++;
        }
      }

      return {
        title: screen.title,
        elements,
      };
    }),
  };
}
