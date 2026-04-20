export type CorrectAnswerType = "NONE" | "STATIC" | "DYNAMIC";

export const DYNAMIC_ANSWER_KEYS = [
  "TODAY_DATE",
  "CURRENT_YEAR",
  "CURRENT_MONTH",
  "CURRENT_DAY_OF_WEEK",
] as const;

export type QComponentType =
  | "heading"
  | "paragraph"
  | "infoCard"
  | "image"
  | "icon"
  | "textInput"
  | "numberInput"
  | "dropdown"
  | "multiSelect"
  | "radioGroup"
  | "cardRadioGroup"
  | "cardMultiSelect"
  | "datePicker"
  | "timePicker"
  | "scale"
  | "toggleSwitch"
  | "button"
  | "rowContainer"
  | "cognitiveField";

export type QComponentCategory =
  | "textDisplay"
  | "userInputs"
  | "actions"
  | "structure"
  | "cognitiveFields";

export type DeviceSize = "mobile" | "tablet" | "desktop";

export interface IQOptionItem {
  label: string;
  value: string;
  isCorrect?: boolean;
  score?: number;
}

export const OPTION_BASED_TYPES = new Set<QComponentType>([
  "dropdown",
  "multiSelect",
  "radioGroup",
  "cardRadioGroup",
  "cardMultiSelect",
]);

export function isOptionBasedComponent(type: QComponentType): boolean {
  return OPTION_BASED_TYPES.has(type);
}

interface IQBase {
  id: string;
  label: string;
}

export interface IQHeading extends IQBase {
  type: "heading";
  text: string;
  level: 1 | 2 | 3 | 4;
}

export interface IQParagraph extends IQBase {
  type: "paragraph";
  text: string;
}

export interface IQInfoCard extends IQBase {
  type: "infoCard";
  text: string;
  variant: "info" | "warning" | "success" | "error";
}

export interface IQImage extends IQBase {
  type: "image";
  src: string;
  alt: string;
}

export interface IQIcon extends IQBase {
  type: "icon";
  iconName: string;
  size: number;
}

export interface IQTextInput extends IQBase {
  type: "textInput";
  placeholder: string;
  required: boolean;
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQNumberInput extends IQBase {
  type: "numberInput";
  placeholder: string;
  required: boolean;
  min: number;
  max: number;
  step: number;
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQDropdown extends IQBase {
  type: "dropdown";
  placeholder: string;
  required: boolean;
  options: IQOptionItem[];
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQMultiSelect extends IQBase {
  type: "multiSelect";
  placeholder: string;
  required: boolean;
  options: IQOptionItem[];
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
  allowPartialScore?: boolean;
}

export interface IQRadioGroup extends IQBase {
  type: "radioGroup";
  required: boolean;
  options: IQOptionItem[];
  layout: "vertical" | "horizontal";
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQCardRadioGroup extends IQBase {
  type: "cardRadioGroup";
  required: boolean;
  options: IQOptionItem[];
  layout: "vertical" | "horizontal";
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQCardMultiSelect extends IQBase {
  type: "cardMultiSelect";
  required: boolean;
  options: IQOptionItem[];
  layout: "vertical" | "horizontal";
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
  allowPartialScore?: boolean;
}

export interface IQDatePicker extends IQBase {
  type: "datePicker";
  placeholder: string;
  required: boolean;
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQTimePicker extends IQBase {
  type: "timePicker";
  placeholder: string;
  required: boolean;
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQScale extends IQBase {
  type: "scale";
  min: number;
  max: number;
  step: number;
  required: boolean;
  minLabel?: string;
  maxLabel?: string;
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQToggleSwitch extends IQBase {
  type: "toggleSwitch";
  defaultValue: boolean;
  required: boolean;
  trueLabel?: string;
  falseLabel?: string;
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQButton extends IQBase {
  type: "button";
  text: string;
  variant: "primary" | "secondary" | "outline";
}

export interface IQRowContainer extends IQBase {
  type: "rowContainer";
  children: IQComponent[];
}

export interface IQCognitiveField extends IQBase {
  type: "cognitiveField";
  required: boolean;
  fieldKey: string;
  dataType: "number" | "text" | "boolean" | "list";
}

export type IQComponent =
  | IQHeading
  | IQParagraph
  | IQInfoCard
  | IQImage
  | IQIcon
  | IQTextInput
  | IQNumberInput
  | IQDropdown
  | IQMultiSelect
  | IQRadioGroup
  | IQCardRadioGroup
  | IQCardMultiSelect
  | IQDatePicker
  | IQTimePicker
  | IQScale
  | IQToggleSwitch
  | IQButton
  | IQRowContainer
  | IQCognitiveField;

export interface IQScreen {
  id: string;
  title: string;
  components: IQComponent[];
}

export function createDefaultScreen(title?: string): IQScreen {
  return {
    id: crypto.randomUUID(),
    title: title ?? "Screen 1",
    components: [],
  };
}

export interface ISubmissionElementRef {
  id: string;
  element_type: string;
  label: string;
  config: Record<string, unknown>;
}

export interface ISubmissionAnswer {
  element: ISubmissionElementRef;
  value: unknown;
  is_correct: boolean | null;
  points_earned: number | null;
}

export interface ISubmissionResult {
  id: string;
  score: number | null;
  submitted_at: string;
  answers: ISubmissionAnswer[];
}

export const MeasurementType = {
  QUESTIONNAIRES: "QUESTIONNAIRES",
  COGNITIVE_TESTS: "COGNITIVE_TESTS",
  MODULE_QUESTIONNAIRE: "MODULE_QUESTIONNAIRE",
} as const;
export type MeasurementType = (typeof MeasurementType)[keyof typeof MeasurementType];

export interface IMeasurement {
  id: string;
  name: string;
  type: MeasurementType;
  isPublic: boolean;
  isActive: boolean;
  screens?: IQScreen[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  clinicId: string;
}
