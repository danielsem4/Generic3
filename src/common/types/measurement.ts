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
  | "datePicker"
  | "timePicker"
  | "scale"
  | "toggleSwitch"
  | "button"
  | "rowContainer";

export type QComponentCategory =
  | "textDisplay"
  | "userInputs"
  | "actions"
  | "structure";

export type DeviceSize = "mobile" | "tablet" | "desktop";

export interface IQOptionItem {
  label: string;
  value: string;
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
  correctAnswerType?: CorrectAnswerType;
  correctAnswer?: string;
  grade?: number;
}

export interface IQToggleSwitch extends IQBase {
  type: "toggleSwitch";
  defaultValue: boolean;
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
  | IQDatePicker
  | IQTimePicker
  | IQScale
  | IQToggleSwitch
  | IQButton
  | IQRowContainer;

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
