import {
  Heading1,
  AlignLeft,
  Info,
  ImageIcon,
  SmileIcon,
  TextCursorInput,
  Hash,
  ChevronDown,
  ListChecks,
  CircleDot,
  Calendar,
  Clock,
  SlidersHorizontal,
  ToggleLeft,
  MousePointerClick,
  Columns,
} from "lucide-react";
import type { ElementType } from "react";
import type {
  QComponentType,
  QComponentCategory,
  IQComponent,
} from "@/common/types/measurement";

type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never;

export type PropertyFieldType =
  | "text"
  | "number"
  | "toggle"
  | "select"
  | "optionsList";

export interface PropertyFieldConfig {
  key: string;
  labelKey: string;
  fieldType: PropertyFieldType;
  options?: { label: string; value: string }[];
  visibleWhen?: { key: string; values: string[] };
}

export interface ComponentRegistryEntry {
  labelKey: string;
  icon: ElementType;
  category: QComponentCategory;
  defaultProps: DistributiveOmit<IQComponent, "id">;
  propertyFields: PropertyFieldConfig[];
}

export const componentRegistry: Record<QComponentType, ComponentRegistryEntry> =
  {
    heading: {
      labelKey: "measurements.components.heading",
      icon: Heading1,
      category: "textDisplay",
      defaultProps: {
        type: "heading",
        label: "Heading",
        text: "Heading text",
        level: 1,
      },
      propertyFields: [
        { key: "text", labelKey: "measurements.props.text", fieldType: "text" },
        {
          key: "level",
          labelKey: "measurements.props.level",
          fieldType: "select",
          options: [
            { label: "H1", value: "1" },
            { label: "H2", value: "2" },
            { label: "H3", value: "3" },
            { label: "H4", value: "4" },
          ],
        },
      ],
    },

    paragraph: {
      labelKey: "measurements.components.paragraph",
      icon: AlignLeft,
      category: "textDisplay",
      defaultProps: {
        type: "paragraph",
        label: "Paragraph",
        text: "Paragraph text",
      },
      propertyFields: [
        { key: "text", labelKey: "measurements.props.text", fieldType: "text" },
      ],
    },

    infoCard: {
      labelKey: "measurements.components.infoCard",
      icon: Info,
      category: "textDisplay",
      defaultProps: {
        type: "infoCard",
        label: "Info Card",
        text: "Info text",
        variant: "info",
      },
      propertyFields: [
        { key: "text", labelKey: "measurements.props.text", fieldType: "text" },
        {
          key: "variant",
          labelKey: "measurements.props.variant",
          fieldType: "select",
          options: [
            { label: "Info", value: "info" },
            { label: "Warning", value: "warning" },
            { label: "Success", value: "success" },
            { label: "Error", value: "error" },
          ],
        },
      ],
    },

    image: {
      labelKey: "measurements.components.image",
      icon: ImageIcon,
      category: "textDisplay",
      defaultProps: {
        type: "image",
        label: "Image",
        src: "",
        alt: "Image",
      },
      propertyFields: [
        { key: "src", labelKey: "measurements.props.src", fieldType: "text" },
        { key: "alt", labelKey: "measurements.props.alt", fieldType: "text" },
      ],
    },

    icon: {
      labelKey: "measurements.components.icon",
      icon: SmileIcon,
      category: "textDisplay",
      defaultProps: {
        type: "icon",
        label: "Icon",
        iconName: "star",
        size: 24,
      },
      propertyFields: [
        {
          key: "iconName",
          labelKey: "measurements.props.iconName",
          fieldType: "text",
        },
        {
          key: "size",
          labelKey: "measurements.props.size",
          fieldType: "number",
        },
      ],
    },

    textInput: {
      labelKey: "measurements.components.textInput",
      icon: TextCursorInput,
      category: "userInputs",
      defaultProps: {
        type: "textInput",
        label: "Text Input",
        placeholder: "Enter text...",
        required: false,
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "measurements.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    numberInput: {
      labelKey: "measurements.components.numberInput",
      icon: Hash,
      category: "userInputs",
      defaultProps: {
        type: "numberInput",
        label: "Number Input",
        placeholder: "Enter number...",
        required: false,
        min: 0,
        max: 100,
        step: 1,
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "measurements.props.placeholder",
          fieldType: "text",
        },
        { key: "min", labelKey: "measurements.props.min", fieldType: "number" },
        { key: "max", labelKey: "measurements.props.max", fieldType: "number" },
        {
          key: "step",
          labelKey: "measurements.props.step",
          fieldType: "number",
        },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    dropdown: {
      labelKey: "measurements.components.dropdown",
      icon: ChevronDown,
      category: "userInputs",
      defaultProps: {
        type: "dropdown",
        label: "Dropdown",
        placeholder: "Select...",
        required: false,
        options: [{ label: "Option 1", value: "option1" }],
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "measurements.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
          key: "options",
          labelKey: "measurements.props.options",
          fieldType: "optionsList",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    multiSelect: {
      labelKey: "measurements.components.multiSelect",
      icon: ListChecks,
      category: "userInputs",
      defaultProps: {
        type: "multiSelect",
        label: "Multi Select",
        placeholder: "Select...",
        required: false,
        options: [{ label: "Option 1", value: "option1" }],
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "measurements.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
          key: "options",
          labelKey: "measurements.props.options",
          fieldType: "optionsList",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    radioGroup: {
      labelKey: "measurements.components.radioGroup",
      icon: CircleDot,
      category: "userInputs",
      defaultProps: {
        type: "radioGroup",
        label: "Radio Group",
        required: false,
        options: [{ label: "Option 1", value: "option1" }],
        layout: "vertical",
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
          key: "layout",
          labelKey: "measurements.props.layout",
          fieldType: "select",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        },
        {
          key: "options",
          labelKey: "measurements.props.options",
          fieldType: "optionsList",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    datePicker: {
      labelKey: "measurements.components.datePicker",
      icon: Calendar,
      category: "userInputs",
      defaultProps: {
        type: "datePicker",
        label: "Date Picker",
        placeholder: "Select date...",
        required: false,
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "measurements.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    timePicker: {
      labelKey: "measurements.components.timePicker",
      icon: Clock,
      category: "userInputs",
      defaultProps: {
        type: "timePicker",
        label: "Time Picker",
        placeholder: "Select time...",
        required: false,
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "measurements.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    scale: {
      labelKey: "measurements.components.scale",
      icon: SlidersHorizontal,
      category: "userInputs",
      defaultProps: {
        type: "scale",
        label: "Scale",
        min: 0,
        max: 10,
        step: 1,
        required: false,
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        { key: "min", labelKey: "measurements.props.min", fieldType: "number" },
        { key: "max", labelKey: "measurements.props.max", fieldType: "number" },
        {
          key: "step",
          labelKey: "measurements.props.step",
          fieldType: "number",
        },
        {
          key: "required",
          labelKey: "measurements.props.required",
          fieldType: "toggle",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    toggleSwitch: {
      labelKey: "measurements.components.toggleSwitch",
      icon: ToggleLeft,
      category: "userInputs",
      defaultProps: {
        type: "toggleSwitch",
        label: "Toggle",
        defaultValue: false,
<<<<<<< Updated upstream
=======
        correctAnswerType: "NONE",
>>>>>>> Stashed changes
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
        {
          key: "defaultValue",
          labelKey: "measurements.props.defaultValue",
          fieldType: "toggle",
        },
        {
<<<<<<< Updated upstream
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
=======
          key: "correctAnswerType",
          labelKey: "measurements.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "measurements.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
        {
          key: "grade",
          labelKey: "measurements.props.grade",
          fieldType: "number",
<<<<<<< Updated upstream
=======
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
>>>>>>> Stashed changes
        },
      ],
    },

    button: {
      labelKey: "measurements.components.button",
      icon: MousePointerClick,
      category: "actions",
      defaultProps: {
        type: "button",
        label: "Button",
        text: "Click me",
        variant: "primary",
      },
      propertyFields: [
        { key: "text", labelKey: "measurements.props.text", fieldType: "text" },
        {
          key: "variant",
          labelKey: "measurements.props.variant",
          fieldType: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
      ],
    },

    rowContainer: {
      labelKey: "measurements.components.rowContainer",
      icon: Columns,
      category: "structure",
      defaultProps: {
        type: "rowContainer",
        label: "Row Container",
        children: [],
      },
      propertyFields: [
        { key: "label", labelKey: "measurements.props.label", fieldType: "text" },
      ],
    },
  };

export function createComponentFromType(type: QComponentType): IQComponent {
  const entry = componentRegistry[type];
  return {
    id: crypto.randomUUID(),
    ...entry.defaultProps,
  } as IQComponent;
}
