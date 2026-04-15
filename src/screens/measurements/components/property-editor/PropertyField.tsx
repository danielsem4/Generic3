import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PropertyFieldConfig } from "../../lib/componentRegistry";
import type { IQOptionItem, CorrectAnswerType, QComponentType } from "@/common/types/measurement";
import { OptionsListEditor } from "./OptionsListEditor";

interface PropertyFieldProps {
  field: PropertyFieldConfig;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
  correctAnswerType?: CorrectAnswerType;
  componentType?: QComponentType;
}

export function PropertyField({
  field,
  value,
  onChange,
  correctAnswerType,
  componentType,
}: PropertyFieldProps) {
  const { t } = useTranslation();

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(field.key, e.target.value);
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(field.key, Number(e.target.value));
  }

  function handleToggleChange(checked: boolean) {
    onChange(field.key, checked);
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = field.key === "level" ? Number(e.target.value) : e.target.value;
    onChange(field.key, val);
  }

  function handleOptionsChange(options: IQOptionItem[]) {
    onChange(field.key, options);
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{t(field.labelKey)}</Label>

      {field.fieldType === "text" && (
        <Input
          value={(value as string) ?? ""}
          onChange={handleTextChange}
          className="h-8 text-sm"
        />
      )}

      {field.fieldType === "number" && (
        <Input
          type="number"
          value={(value as number) ?? 0}
          onChange={handleNumberChange}
          className="h-8 text-sm"
        />
      )}

      {field.fieldType === "toggle" && (
        <Switch
          checked={(value as boolean) ?? false}
          onCheckedChange={handleToggleChange}
        />
      )}

      {field.fieldType === "select" && (
        <select
          value={String(value ?? "")}
          onChange={handleSelectChange}
          className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.fieldType === "optionsList" && (
        <OptionsListEditor
          options={(value as IQOptionItem[]) ?? []}
          onChange={handleOptionsChange}
          correctAnswerType={correctAnswerType}
          componentType={componentType}
        />
      )}
    </div>
  );
}
