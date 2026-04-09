import { useState } from "react";
import type { IQComponent } from "@/common/types/questionnaire";
import { Switch } from "@/components/ui/switch";

export function InteractiveComponentPreview({
  component,
}: {
  component: IQComponent;
}) {
  switch (component.type) {
    case "heading":
      return <HeadingPreview component={component} />;
    case "paragraph":
      return <p className="text-sm text-muted-foreground">{component.text}</p>;
    case "infoCard":
      return <InfoCardPreview component={component} />;
    case "image":
      return <ImagePreview component={component} />;
    case "icon":
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          [{component.iconName}] {component.label}
        </div>
      );
    case "textInput":
      return <TextInputPreview component={component} />;
    case "numberInput":
      return <NumberInputPreview component={component} />;
    case "dropdown":
      return <DropdownPreview component={component} />;
    case "multiSelect":
      return <MultiSelectPreview component={component} />;
    case "radioGroup":
      return <RadioGroupPreview component={component} />;
    case "datePicker":
      return <DatePickerPreview component={component} />;
    case "timePicker":
      return <TimePickerPreview component={component} />;
    case "scale":
      return <ScalePreview component={component} />;
    case "toggleSwitch":
      return <ToggleSwitchPreview component={component} />;
    case "button":
      return <ButtonPreview component={component} />;
    default:
      return (
        <div className="text-sm text-muted-foreground">{component.label}</div>
      );
  }
}

function HeadingPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "heading" }>;
}) {
  const Tag = `h${component.level}` as keyof JSX.IntrinsicElements;
  const sizes = {
    1: "text-2xl",
    2: "text-xl",
    3: "text-lg",
    4: "text-base",
  };
  return (
    <Tag className={`font-bold ${sizes[component.level]}`}>
      {component.text}
    </Tag>
  );
}

function InfoCardPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "infoCard" }>;
}) {
  const colors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div className={`rounded-md border p-3 text-sm ${colors[component.variant]}`}>
      {component.text}
    </div>
  );
}

function ImagePreview({
  component,
}: {
  component: Extract<IQComponent, { type: "image" }>;
}) {
  return (
    <div className="flex h-24 items-center justify-center rounded bg-muted text-sm text-muted-foreground">
      {component.src ? (
        <img
          src={component.src}
          alt={component.alt}
          className="max-h-full object-contain"
        />
      ) : (
        `[Image: ${component.alt}]`
      )}
    </div>
  );
}

function TextInputPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "textInput" }>;
}) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={component.placeholder}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function NumberInputPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "numberInput" }>;
}) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={component.placeholder}
        min={component.min}
        max={component.max}
        step={component.step}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function DropdownPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "dropdown" }>;
}) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setValue(e.target.value);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <select
        value={value}
        onChange={handleChange}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="" disabled>
          {component.placeholder}
        </option>
        {component.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelectPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "multiSelect" }>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function handleToggle(optValue: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(optValue)) {
        next.delete(optValue);
      } else {
        next.add(optValue);
      }
      return next;
    });
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <div className="space-y-1.5">
        {component.options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.has(opt.value)}
              onChange={() => handleToggle(opt.value)}
              className="h-4 w-4 rounded border-gray-300"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function RadioGroupPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "radioGroup" }>;
}) {
  const [value, setValue] = useState("");

  function handleChange(optValue: string) {
    setValue(optValue);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <div
        className={`flex gap-3 ${component.layout === "vertical" ? "flex-col" : "flex-row"}`}
      >
        {component.options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-1.5 text-sm cursor-pointer"
          >
            <input
              type="radio"
              name={component.id}
              checked={value === opt.value}
              onChange={() => handleChange(opt.value)}
              className="h-4 w-4"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function DatePickerPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "datePicker" }>;
}) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <input
        type="date"
        value={value}
        onChange={handleChange}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function TimePickerPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "timePicker" }>;
}) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <input
        type="time"
        value={value}
        onChange={handleChange}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function ScalePreview({
  component,
}: {
  component: Extract<IQComponent, { type: "scale" }>;
}) {
  const mid = Math.round((component.min + component.max) / 2);
  const [value, setValue] = useState(mid);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(Number(e.target.value));
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{component.label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{component.min}</span>
        <input
          type="range"
          min={component.min}
          max={component.max}
          step={component.step}
          value={value}
          onChange={handleChange}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground">{component.max}</span>
      </div>
      <div className="text-center text-xs text-muted-foreground">{value}</div>
    </div>
  );
}

function ToggleSwitchPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "toggleSwitch" }>;
}) {
  const [checked, setChecked] = useState(component.defaultValue);

  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">{component.label}</label>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

function ButtonPreview({
  component,
}: {
  component: Extract<IQComponent, { type: "button" }>;
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background",
  };
  return (
    <button
      type="button"
      className={`rounded-md px-4 py-2 text-sm font-medium ${variants[component.variant]}`}
    >
      {component.text}
    </button>
  );
}
