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
  LayoutGrid,
  SquareStack,
  Calendar,
  Clock,
  SlidersHorizontal,
  ToggleLeft,
  MousePointerClick,
  Columns,
  Eye,
} from "lucide-react";
import type { ElementType } from "react";
import type {
  QComponentType,
  QComponentCategory,
  IQComponent,
} from "@/common/types/evaluation";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type PropertyFieldType =
  | "text"
  | "number"
  | "toggle"
  | "select"
  | "optionsList"
  | "keySelector"
  | "spotsList";

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
      labelKey: "evaluations.components.heading",
      icon: Heading1,
      category: "textDisplay",
      defaultProps: {
        type: "heading",
        label: "Heading",
        text: "Heading text",
        level: 1,
      },
      propertyFields: [
        { key: "text", labelKey: "evaluations.props.text", fieldType: "text" },
        {
          key: "level",
          labelKey: "evaluations.props.level",
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
      labelKey: "evaluations.components.paragraph",
      icon: AlignLeft,
      category: "textDisplay",
      defaultProps: {
        type: "paragraph",
        label: "Paragraph",
        text: "Paragraph text",
      },
      propertyFields: [
        { key: "text", labelKey: "evaluations.props.text", fieldType: "text" },
      ],
    },

    infoCard: {
      labelKey: "evaluations.components.infoCard",
      icon: Info,
      category: "textDisplay",
      defaultProps: {
        type: "infoCard",
        label: "Info Card",
        text: "Info text",
        variant: "info",
      },
      propertyFields: [
        { key: "text", labelKey: "evaluations.props.text", fieldType: "text" },
        {
          key: "variant",
          labelKey: "evaluations.props.variant",
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
      labelKey: "evaluations.components.image",
      icon: ImageIcon,
      category: "textDisplay",
      defaultProps: {
        type: "image",
        label: "Image",
        src: "",
        alt: "Image",
      },
      propertyFields: [
        { key: "src", labelKey: "evaluations.props.src", fieldType: "text" },
        { key: "alt", labelKey: "evaluations.props.alt", fieldType: "text" },
      ],
    },

    icon: {
      labelKey: "evaluations.components.icon",
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
          labelKey: "evaluations.props.iconName",
          fieldType: "text",
        },
        {
          key: "size",
          labelKey: "evaluations.props.size",
          fieldType: "number",
        },
      ],
    },

    textInput: {
      labelKey: "evaluations.components.textInput",
      icon: TextCursorInput,
      category: "userInputs",
      defaultProps: {
        type: "textInput",
        label: "Text Input",
        placeholder: "Enter text...",
        required: false,
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "evaluations.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    numberInput: {
      labelKey: "evaluations.components.numberInput",
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
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "evaluations.props.placeholder",
          fieldType: "text",
        },
        { key: "min", labelKey: "evaluations.props.min", fieldType: "number" },
        { key: "max", labelKey: "evaluations.props.max", fieldType: "number" },
        {
          key: "step",
          labelKey: "evaluations.props.step",
          fieldType: "number",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    dropdown: {
      labelKey: "evaluations.components.dropdown",
      icon: ChevronDown,
      category: "userInputs",
      defaultProps: {
        type: "dropdown",
        label: "Dropdown",
        placeholder: "Select...",
        required: false,
        options: [{ id: crypto.randomUUID(), label: "Option 1", value: "option1" }],
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "evaluations.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "options",
          labelKey: "evaluations.props.options",
          fieldType: "optionsList",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    multiSelect: {
      labelKey: "evaluations.components.multiSelect",
      icon: ListChecks,
      category: "userInputs",
      defaultProps: {
        type: "multiSelect",
        label: "Multi Select",
        placeholder: "Select...",
        required: false,
        options: [{ id: crypto.randomUUID(), label: "Option 1", value: "option1" }],
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
        allowPartialScore: false,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "evaluations.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "options",
          labelKey: "evaluations.props.options",
          fieldType: "optionsList",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "allowPartialScore",
          labelKey: "evaluations.props.allowPartialScore",
          fieldType: "toggle",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC"] },
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    radioGroup: {
      labelKey: "evaluations.components.radioGroup",
      icon: CircleDot,
      category: "userInputs",
      defaultProps: {
        type: "radioGroup",
        label: "Radio Group",
        required: false,
        options: [{ id: crypto.randomUUID(), label: "Option 1", value: "option1" }],
        layout: "vertical",
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "layout",
          labelKey: "evaluations.props.layout",
          fieldType: "select",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        },
        {
          key: "options",
          labelKey: "evaluations.props.options",
          fieldType: "optionsList",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    cardRadioGroup: {
      labelKey: "evaluations.components.cardRadioGroup",
      icon: LayoutGrid,
      category: "userInputs",
      defaultProps: {
        type: "cardRadioGroup",
        label: "Card Radio",
        required: false,
        options: [{ id: crypto.randomUUID(), label: "Option 1", value: "option1" }],
        layout: "vertical",
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "layout",
          labelKey: "evaluations.props.layout",
          fieldType: "select",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        },
        {
          key: "options",
          labelKey: "evaluations.props.options",
          fieldType: "optionsList",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    cardMultiSelect: {
      labelKey: "evaluations.components.cardMultiSelect",
      icon: SquareStack,
      category: "userInputs",
      defaultProps: {
        type: "cardMultiSelect",
        label: "Card Multi",
        required: false,
        options: [{ id: crypto.randomUUID(), label: "Option 1", value: "option1" }],
        layout: "vertical",
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
        allowPartialScore: false,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "layout",
          labelKey: "evaluations.props.layout",
          fieldType: "select",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        },
        {
          key: "options",
          labelKey: "evaluations.props.options",
          fieldType: "optionsList",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "allowPartialScore",
          labelKey: "evaluations.props.allowPartialScore",
          fieldType: "toggle",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC"] },
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    datePicker: {
      labelKey: "evaluations.components.datePicker",
      icon: Calendar,
      category: "userInputs",
      defaultProps: {
        type: "datePicker",
        label: "Date Picker",
        placeholder: "Select date...",
        required: false,
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "evaluations.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    timePicker: {
      labelKey: "evaluations.components.timePicker",
      icon: Clock,
      category: "userInputs",
      defaultProps: {
        type: "timePicker",
        label: "Time Picker",
        placeholder: "Select time...",
        required: false,
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "evaluations.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    scale: {
      labelKey: "evaluations.components.scale",
      icon: SlidersHorizontal,
      category: "userInputs",
      defaultProps: {
        type: "scale",
        label: "Scale",
        min: 0,
        max: 10,
        step: 1,
        required: false,
        minLabel: "",
        maxLabel: "",
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        { key: "min", labelKey: "evaluations.props.min", fieldType: "number" },
        { key: "max", labelKey: "evaluations.props.max", fieldType: "number" },
        {
          key: "step",
          labelKey: "evaluations.props.step",
          fieldType: "number",
        },
        {
          key: "minLabel",
          labelKey: "evaluations.props.minLabel",
          fieldType: "text",
        },
        {
          key: "maxLabel",
          labelKey: "evaluations.props.maxLabel",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    toggleSwitch: {
      labelKey: "evaluations.components.toggleSwitch",
      icon: ToggleLeft,
      category: "userInputs",
      defaultProps: {
        type: "toggleSwitch",
        label: "Toggle",
        defaultValue: false,
        required: false,
        trueLabel: "Yes",
        falseLabel: "No",
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
        {
          key: "trueLabel",
          labelKey: "evaluations.props.trueLabel",
          fieldType: "text",
        },
        {
          key: "falseLabel",
          labelKey: "evaluations.props.falseLabel",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "evaluations.props.required",
          fieldType: "toggle",
        },
        {
          key: "defaultValue",
          labelKey: "evaluations.props.defaultValue",
          fieldType: "toggle",
        },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
      ],
    },

    button: {
      labelKey: "evaluations.components.button",
      icon: MousePointerClick,
      category: "actions",
      defaultProps: {
        type: "button",
        label: "Button",
        text: "Click me",
        variant: "primary",
      },
      propertyFields: [
        { key: "text", labelKey: "evaluations.props.text", fieldType: "text" },
        {
          key: "variant",
          labelKey: "evaluations.props.variant",
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
      labelKey: "evaluations.components.rowContainer",
      icon: Columns,
      category: "structure",
      defaultProps: {
        type: "rowContainer",
        label: "Row Container",
        children: [],
      },
      propertyFields: [
        { key: "label", labelKey: "evaluations.props.label", fieldType: "text" },
      ],
    },

    visualQuestion: {
      labelKey: "evaluations.components.visualQuestion",
      icon: Eye,
      category: "userInputs",
      defaultProps: {
        type: "visualQuestion",
        label: "Visual Question",
        required: false,
        visualKey: "",
        spots: [],
        correctAnswerType: "NONE",
        correctAnswer: "",
        grade: 0,
      },
      propertyFields: [
        { key: "label",     labelKey: "evaluations.props.label",    fieldType: "text" },
        {
          key: "visualKey",
          labelKey: "evaluations.props.visualKey",
          fieldType: "keySelector",
          options: [
            { label: "Body Map Visual", value: "BODY_MAP_VISUAL" },
            { label: "Cognitive Field", value: "COGNITIVE_FIELD" },
          ],
        },
        {
          key: "spots",
          labelKey: "evaluations.props.spots",
          fieldType: "spotsList",
          visibleWhen: { key: "visualKey", values: ["BODY_MAP_VISUAL"] },
        },
        { key: "required",  labelKey: "evaluations.props.required", fieldType: "toggle" },
        {
          key: "correctAnswerType",
          labelKey: "evaluations.props.correctAnswerType",
          fieldType: "select",
          options: [
            { label: "None", value: "NONE" },
            { label: "Static", value: "STATIC" },
            { label: "Dynamic", value: "DYNAMIC" },
          ],
        },
        {
          key: "correctAnswer",
          labelKey: "evaluations.props.correctAnswer",
          fieldType: "text",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
        {
          key: "grade",
          labelKey: "evaluations.props.grade",
          fieldType: "number",
          visibleWhen: { key: "correctAnswerType", values: ["STATIC", "DYNAMIC"] },
        },
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
