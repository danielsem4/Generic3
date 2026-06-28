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
  | "recordButton"
  | "fileUpload"
  | "keyboard"
  | "rowContainer"
  | "visualQuestion";

export type QComponentCategory =
  | "textDisplay"
  | "userInputs"
  | "actions"
  | "structure";

export type DeviceSize = "mobile" | "tablet" | "desktop";

export interface IQOptionItem {
  id: string;
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

export interface IQComponentVersion {
  id: string;
  versionLabel: string;
  snapshot: Record<string, unknown>;
  createdAt: string;
}

interface IQBase {
  id: string;
  label: string;
  versions?: IQComponentVersion[];
  activeVersionId?: string;
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

export interface IQRecordButton extends IQBase {
  type: "recordButton";
  required: boolean;
  buttonLabel?: string;
}

export interface IQFileUpload extends IQBase {
  type: "fileUpload";
  required: boolean;
  buttonLabel?: string;
  fileType: "photo" | "pdf" | "document" | "any";
}

export interface IQKeyboard extends IQBase {
  type: "keyboard";
  required: boolean;
  keyboardType: "EMOJI_KEYBOARD" | "IPA_KEYBOARD";
}

export interface IQRowContainer extends IQBase {
  type: "rowContainer";
  children: IQComponent[];
}

export interface IQVisualSpot {
  point: string;
  subItems: string[];
}

export interface IQVisualQuestion extends IQBase {
  type: "visualQuestion";
  required: boolean;
  visualKey: string;
  spots: IQVisualSpot[];
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
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
  | IQRecordButton
  | IQFileUpload
  | IQKeyboard
  | IQRowContainer
  | IQVisualQuestion;

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

export const EvaluationType = {
  QUESTIONNAIRES: "QUESTIONNAIRES",
  COGNITIVE_TESTS: "COGNITIVE_TESTS",
  MODULE_QUESTIONNAIRE: "MODULE_QUESTIONNAIRE",
  MEDICAL_STAFF_EVALUATION: "MEDICAL_STAFF_EVALUATION",
} as const;
export type EvaluationType = (typeof EvaluationType)[keyof typeof EvaluationType];

export interface IEvaluation {
  id: string;
  name: string;
  type: EvaluationType;
  isPublic: boolean;
  isActive: boolean;
  screens?: IQScreen[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  clinicId: string;
}
