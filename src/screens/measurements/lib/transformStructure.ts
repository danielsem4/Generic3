import type {
  IQScreen,
  IQComponent,
  IQOptionItem,
  IQVisualQuestion,
  IQVisualSpot,
  CorrectAnswerType,
  QComponentType,
} from "@/common/types/measurement";
import { isOptionBasedComponent } from "@/common/types/measurement";
import { componentRegistry } from "./componentRegistry";

const FRONTEND_TO_BACKEND_TYPE: Record<string, string> = {
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
  allow_partial_score?: boolean;
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
        placeholder: component.placeholder,
        options: component.options.map((o: IQOptionItem) => o.label),
      };
    case "radioGroup":
      return {
        options: component.options.map((o: IQOptionItem) => o.label),
        layout: component.layout,
      };
    case "cardRadioGroup":
      return {
        options: component.options.map((o: IQOptionItem) => o.label),
        layout: component.layout,
        display_style: "cards",
      };
    case "cardMultiSelect":
      return {
        options: component.options.map((o: IQOptionItem) => o.label),
        layout: component.layout,
        display_style: "cards",
      };
    case "numberInput":
      return { placeholder: component.placeholder, min: component.min, max: component.max, step: component.step };
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
  if (component.type === "visualQuestion") {
    const vis = component as IQVisualQuestion;
    const visualKey = vis.visualKey.trim();
    if (!visualKey) return null;
    const config: Record<string, unknown> =
      visualKey === "BODY_MAP_VISUAL" && vis.spots.length > 0
        ? { spots: vis.spots.map((s) => ({ point: s.point, subItems: s.subItems })) }
        : {};
    return {
      label: component.label,
      element_type: visualKey,
      is_required: vis.required,
      row_number: rowNumber,
      order_in_row: orderInRow,
      config,
      correct_answer_type: "NONE",
    };
  }

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

  if (
    (component.type === "multiSelect" || component.type === "cardMultiSelect") &&
    answerType === "STATIC"
  ) {
    field.allow_partial_score =
      ((component as unknown as Record<string, unknown>).allowPartialScore as boolean) ?? false;
  }

  return field;
}

const BACKEND_TO_FRONTEND_TYPE: Record<string, QComponentType> = {
  INPUT_TEXT: "textInput",
  INPUT_NUMBER: "numberInput",
  INPUT_SELECT: "dropdown",
  INPUT_MULTI_SELECT: "multiSelect",
  INPUT_RADIO: "radioGroup",
  INPUT_DATE: "datePicker",
  INPUT_TIME: "timePicker",
  INPUT_SCALE: "scale",
  INPUT_BOOLEAN: "toggleSwitch",
  HEADER: "heading",
  PARAGRAPH: "paragraph",
  INFO_CARD: "infoCard",
  IMAGE: "image",
  ICON: "icon",
  BUTTON: "button",
};

export interface IServerElement {
  id: string;
  element_type: string;
  row_number: number;
  order_in_row: number;
  label: string;
  is_required: boolean;
  config: Record<string, unknown>;
  correct_answer_type: CorrectAnswerType;
  correct_answers?: CorrectAnswerEntry[] | null;
  allow_partial_score?: boolean;
}

export interface IServerScreen {
  id: string;
  screen_number: number;
  title: string;
  rows: Array<{ row_number: number; elements: IServerElement[] }>;
}

export interface IServerStructureResponse {
  measurement_id: string;
  measurement_name: string;
  screens: IServerScreen[];
}

const DISPLAY_TYPES: QComponentType[] = [
  "heading",
  "paragraph",
  "infoCard",
  "image",
  "icon",
  "button",
];

function getString(
  config: Record<string, unknown>,
  key: string,
  fallback = "",
): string {
  const value = config[key];
  return typeof value === "string" ? value : fallback;
}

function getNumber(
  config: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const value = config[key];
  return typeof value === "number" ? value : fallback;
}

function getBoolean(
  config: Record<string, unknown>,
  key: string,
  fallback: boolean,
): boolean {
  const value = config[key];
  return typeof value === "boolean" ? value : fallback;
}

function getStringArray(
  config: Record<string, unknown>,
  key: string,
): string[] {
  const value = config[key];
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function buildOptionsFromConfig(
  config: Record<string, unknown>,
): IQOptionItem[] {
  return getStringArray(config, "options").map((label) => ({
    label,
    value: label,
  }));
}

function applyOptionCorrectAnswers(
  options: IQOptionItem[],
  correctAnswers: CorrectAnswerEntry[] | null | undefined,
): IQOptionItem[] {
  if (!correctAnswers || correctAnswers.length === 0) return options;
  const byLabel = new Map(correctAnswers.map((c) => [c.answer, c.points]));
  return options.map((option) =>
    byLabel.has(option.label)
      ? { ...option, isCorrect: true, score: byLabel.get(option.label) ?? 0 }
      : option,
  );
}

function buildScalarCorrectAnswer(
  correctAnswers: CorrectAnswerEntry[] | null | undefined,
): { correctAnswer: string; grade: number } {
  const first = correctAnswers?.[0];
  return {
    correctAnswer: first?.answer ?? "",
    grade: first?.points ?? 0,
  };
}

function buildComponentFromElement(element: IServerElement): IQComponent | null {
  let frontendType = BACKEND_TO_FRONTEND_TYPE[element.element_type];

  if (!frontendType) {
    const config = element.config ?? {};
    const rawSpots = Array.isArray(config.spots) ? config.spots : [];
    const spots: IQVisualSpot[] = rawSpots
      .filter((s): s is Record<string, unknown> => typeof s === "object" && s !== null)
      .map((s) => ({
        point: typeof s.point === "string" ? s.point : "",
        subItems: Array.isArray(s.subItems)
          ? s.subItems.filter((v): v is string => typeof v === "string")
          : [],
      }));
    return {
      id: element.id,
      type: "visualQuestion",
      label: element.label,
      required: element.is_required,
      visualKey: element.element_type,
      spots,
    } as IQComponent;
  }

  const config = element.config ?? {};
  const isCards = getString(config, "display_style") === "cards";
  if (isCards && frontendType === "radioGroup") frontendType = "cardRadioGroup";
  else if (isCards && frontendType === "multiSelect")
    frontendType = "cardMultiSelect";

  const registryDefaults = componentRegistry[frontendType].defaultProps;
  const answerType = element.correct_answer_type;
  const correctAnswers = element.correct_answers;
  const isDisplay = DISPLAY_TYPES.includes(frontendType);
  const required = !isDisplay ? element.is_required : false;

  const base = {
    ...registryDefaults,
    id: element.id,
    label: element.label,
  };

  switch (frontendType) {
    case "textInput": {
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: "textInput",
        placeholder: getString(config, "placeholder"),
        required,
        correctAnswerType: answerType,
        correctAnswer,
        grade,
      } as IQComponent;
    }
    case "numberInput": {
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: "numberInput",
        placeholder: getString(config, "placeholder"),
        required,
        min: getNumber(config, "min", 0),
        max: getNumber(config, "max", 100),
        step: getNumber(config, "step", 1),
        correctAnswerType: answerType,
        correctAnswer,
        grade,
      } as IQComponent;
    }
    case "dropdown":
    case "multiSelect": {
      const baseOptions = buildOptionsFromConfig(config);
      const options =
        answerType === "STATIC"
          ? applyOptionCorrectAnswers(baseOptions, correctAnswers)
          : baseOptions;
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: frontendType,
        placeholder: getString(config, "placeholder"),
        required,
        options,
        correctAnswerType: answerType,
        correctAnswer,
        grade,
        ...(frontendType === "multiSelect" && {
          allowPartialScore: element.allow_partial_score ?? false,
        }),
      } as IQComponent;
    }
    case "cardMultiSelect": {
      const baseOptions = buildOptionsFromConfig(config);
      const options =
        answerType === "STATIC"
          ? applyOptionCorrectAnswers(baseOptions, correctAnswers)
          : baseOptions;
      const layoutValue = getString(config, "layout", "vertical");
      const layout: "vertical" | "horizontal" =
        layoutValue === "horizontal" ? "horizontal" : "vertical";
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: "cardMultiSelect",
        required,
        options,
        layout,
        correctAnswerType: answerType,
        correctAnswer,
        grade,
        allowPartialScore: element.allow_partial_score ?? false,
      } as IQComponent;
    }
    case "radioGroup":
    case "cardRadioGroup": {
      const baseOptions = buildOptionsFromConfig(config);
      const options =
        answerType === "STATIC"
          ? applyOptionCorrectAnswers(baseOptions, correctAnswers)
          : baseOptions;
      const layoutValue = getString(config, "layout", "vertical");
      const layout: "vertical" | "horizontal" =
        layoutValue === "horizontal" ? "horizontal" : "vertical";
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: frontendType,
        required,
        options,
        layout,
        correctAnswerType: answerType,
        correctAnswer,
        grade,
      } as IQComponent;
    }
    case "datePicker":
    case "timePicker": {
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: frontendType,
        placeholder: getString(config, "placeholder"),
        required,
        correctAnswerType: answerType,
        correctAnswer,
        grade,
      } as IQComponent;
    }
    case "scale": {
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: "scale",
        min: getNumber(config, "min", 0),
        max: getNumber(config, "max", 10),
        step: getNumber(config, "step", 1),
        required,
        minLabel: getString(config, "min_label"),
        maxLabel: getString(config, "max_label"),
        correctAnswerType: answerType,
        correctAnswer,
        grade,
      } as IQComponent;
    }
    case "toggleSwitch": {
      const { correctAnswer, grade } = buildScalarCorrectAnswer(correctAnswers);
      return {
        ...base,
        type: "toggleSwitch",
        defaultValue: getBoolean(config, "default_value", false),
        required,
        trueLabel: getString(config, "true_label", "Yes"),
        falseLabel: getString(config, "false_label", "No"),
        correctAnswerType: answerType,
        correctAnswer,
        grade,
      } as IQComponent;
    }
    case "heading":
    case "paragraph":
    case "infoCard":
    case "button": {
      return {
        ...base,
        text: element.label,
      } as IQComponent;
    }
    case "image":
    case "icon": {
      return base as IQComponent;
    }
    default:
      return null;
  }
}

function buildScreenFromServer(serverScreen: IServerScreen): IQScreen {
  const sortedRows = [...(serverScreen.rows ?? [])].sort(
    (a, b) => a.row_number - b.row_number,
  );

  const components: IQComponent[] = [];
  for (const row of sortedRows) {
    const sortedElements = [...row.elements].sort(
      (a, b) => a.order_in_row - b.order_in_row,
    );
    const children = sortedElements
      .map(buildComponentFromElement)
      .filter((c): c is IQComponent => c !== null);

    if (children.length === 0) continue;

    if (children.length === 1) {
      components.push(children[0]);
    } else {
      components.push({
        id: crypto.randomUUID(),
        type: "rowContainer",
        label: "Row Container",
        children,
      });
    }
  }

  return {
    id: serverScreen.id ?? crypto.randomUUID(),
    title: serverScreen.title,
    components,
  };
}

export function transformPayloadToScreens(
  response: IServerStructureResponse,
): IQScreen[] {
  return [...response.screens]
    .sort((a, b) => a.screen_number - b.screen_number)
    .map(buildScreenFromServer);
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
