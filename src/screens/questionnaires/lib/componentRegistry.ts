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
} from "@/common/types/questionnaire";

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
}

export interface ComponentRegistryEntry {
  labelKey: string;
  icon: ElementType;
  category: QComponentCategory;
  defaultProps: Omit<IQComponent, "id">;
  propertyFields: PropertyFieldConfig[];
}

export const componentRegistry: Record<QComponentType, ComponentRegistryEntry> =
  {
    heading: {
      labelKey: "questionnaires.components.heading",
      icon: Heading1,
      category: "textDisplay",
      defaultProps: {
        type: "heading",
        label: "Heading",
        text: "Heading text",
        level: 1,
      },
      propertyFields: [
        { key: "text", labelKey: "questionnaires.props.text", fieldType: "text" },
        {
          key: "level",
          labelKey: "questionnaires.props.level",
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
      labelKey: "questionnaires.components.paragraph",
      icon: AlignLeft,
      category: "textDisplay",
      defaultProps: {
        type: "paragraph",
        label: "Paragraph",
        text: "Paragraph text",
      },
      propertyFields: [
        { key: "text", labelKey: "questionnaires.props.text", fieldType: "text" },
      ],
    },

    infoCard: {
      labelKey: "questionnaires.components.infoCard",
      icon: Info,
      category: "textDisplay",
      defaultProps: {
        type: "infoCard",
        label: "Info Card",
        text: "Info text",
        variant: "info",
      },
      propertyFields: [
        { key: "text", labelKey: "questionnaires.props.text", fieldType: "text" },
        {
          key: "variant",
          labelKey: "questionnaires.props.variant",
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
      labelKey: "questionnaires.components.image",
      icon: ImageIcon,
      category: "textDisplay",
      defaultProps: {
        type: "image",
        label: "Image",
        src: "",
        alt: "Image",
      },
      propertyFields: [
        { key: "src", labelKey: "questionnaires.props.src", fieldType: "text" },
        { key: "alt", labelKey: "questionnaires.props.alt", fieldType: "text" },
      ],
    },

    icon: {
      labelKey: "questionnaires.components.icon",
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
          labelKey: "questionnaires.props.iconName",
          fieldType: "text",
        },
        {
          key: "size",
          labelKey: "questionnaires.props.size",
          fieldType: "number",
        },
      ],
    },

    textInput: {
      labelKey: "questionnaires.components.textInput",
      icon: TextCursorInput,
      category: "userInputs",
      defaultProps: {
        type: "textInput",
        label: "Text Input",
        placeholder: "Enter text...",
        required: false,
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "questionnaires.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
      ],
    },

    numberInput: {
      labelKey: "questionnaires.components.numberInput",
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
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "questionnaires.props.placeholder",
          fieldType: "text",
        },
        { key: "min", labelKey: "questionnaires.props.min", fieldType: "number" },
        { key: "max", labelKey: "questionnaires.props.max", fieldType: "number" },
        {
          key: "step",
          labelKey: "questionnaires.props.step",
          fieldType: "number",
        },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
      ],
    },

    dropdown: {
      labelKey: "questionnaires.components.dropdown",
      icon: ChevronDown,
      category: "userInputs",
      defaultProps: {
        type: "dropdown",
        label: "Dropdown",
        placeholder: "Select...",
        required: false,
        options: [{ label: "Option 1", value: "option1" }],
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "questionnaires.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
        {
          key: "options",
          labelKey: "questionnaires.props.options",
          fieldType: "optionsList",
        },
      ],
    },

    multiSelect: {
      labelKey: "questionnaires.components.multiSelect",
      icon: ListChecks,
      category: "userInputs",
      defaultProps: {
        type: "multiSelect",
        label: "Multi Select",
        placeholder: "Select...",
        required: false,
        options: [{ label: "Option 1", value: "option1" }],
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "questionnaires.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
        {
          key: "options",
          labelKey: "questionnaires.props.options",
          fieldType: "optionsList",
        },
      ],
    },

    radioGroup: {
      labelKey: "questionnaires.components.radioGroup",
      icon: CircleDot,
      category: "userInputs",
      defaultProps: {
        type: "radioGroup",
        label: "Radio Group",
        required: false,
        options: [{ label: "Option 1", value: "option1" }],
        layout: "vertical",
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
        {
          key: "layout",
          labelKey: "questionnaires.props.layout",
          fieldType: "select",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        },
        {
          key: "options",
          labelKey: "questionnaires.props.options",
          fieldType: "optionsList",
        },
      ],
    },

    datePicker: {
      labelKey: "questionnaires.components.datePicker",
      icon: Calendar,
      category: "userInputs",
      defaultProps: {
        type: "datePicker",
        label: "Date Picker",
        placeholder: "Select date...",
        required: false,
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "questionnaires.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
      ],
    },

    timePicker: {
      labelKey: "questionnaires.components.timePicker",
      icon: Clock,
      category: "userInputs",
      defaultProps: {
        type: "timePicker",
        label: "Time Picker",
        placeholder: "Select time...",
        required: false,
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "placeholder",
          labelKey: "questionnaires.props.placeholder",
          fieldType: "text",
        },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
      ],
    },

    scale: {
      labelKey: "questionnaires.components.scale",
      icon: SlidersHorizontal,
      category: "userInputs",
      defaultProps: {
        type: "scale",
        label: "Scale",
        min: 0,
        max: 10,
        step: 1,
        required: false,
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        { key: "min", labelKey: "questionnaires.props.min", fieldType: "number" },
        { key: "max", labelKey: "questionnaires.props.max", fieldType: "number" },
        {
          key: "step",
          labelKey: "questionnaires.props.step",
          fieldType: "number",
        },
        {
          key: "required",
          labelKey: "questionnaires.props.required",
          fieldType: "toggle",
        },
      ],
    },

    toggleSwitch: {
      labelKey: "questionnaires.components.toggleSwitch",
      icon: ToggleLeft,
      category: "userInputs",
      defaultProps: {
        type: "toggleSwitch",
        label: "Toggle",
        defaultValue: false,
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
        {
          key: "defaultValue",
          labelKey: "questionnaires.props.defaultValue",
          fieldType: "toggle",
        },
      ],
    },

    button: {
      labelKey: "questionnaires.components.button",
      icon: MousePointerClick,
      category: "actions",
      defaultProps: {
        type: "button",
        label: "Button",
        text: "Click me",
        variant: "primary",
      },
      propertyFields: [
        { key: "text", labelKey: "questionnaires.props.text", fieldType: "text" },
        {
          key: "variant",
          labelKey: "questionnaires.props.variant",
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
      labelKey: "questionnaires.components.rowContainer",
      icon: Columns,
      category: "structure",
      defaultProps: {
        type: "rowContainer",
        label: "Row Container",
        children: [],
      },
      propertyFields: [
        { key: "label", labelKey: "questionnaires.props.label", fieldType: "text" },
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
