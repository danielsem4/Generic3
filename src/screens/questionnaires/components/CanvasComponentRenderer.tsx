import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical } from "lucide-react";
import type { IQComponent } from "@/common/types/questionnaire";
import { RowContainerRenderer } from "./RowContainerRenderer";

interface CanvasComponentRendererProps {
  component: IQComponent;
  isSelected: boolean;
  isPreview?: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  parentId?: string;
}

export function CanvasComponentRenderer({
  component,
  isSelected,
  isPreview,
  onSelect,
  onRemove,
  parentId,
}: CanvasComponentRendererProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: component.id,
    data: {
      source: "canvas" as const,
      componentId: component.id,
      parentId: parentId ?? null,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (component.type === "rowContainer") {
    return (
      <RowContainerRenderer
        component={component}
        isSelected={isSelected}
        isPreview={isPreview}
        onSelect={onSelect}
        onRemove={onRemove}
        sortableProps={{ ref: setNodeRef, style, attributes, listeners }}
      />
    );
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isPreview) onSelect(component.id);
  }

  function handleRemoveClick(e: React.MouseEvent) {
    e.stopPropagation();
    onRemove(component.id);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`group relative rounded-lg border bg-card p-3 transition-all ${
        isDragging ? "opacity-40" : ""
      } ${isSelected && !isPreview ? "ring-2 ring-primary border-primary" : "hover:border-muted-foreground/30"} ${
        isPreview ? "pointer-events-none" : "cursor-pointer"
      }`}
    >
      {!isPreview && (
        <div
          {...listeners}
          {...attributes}
          className="absolute left-1 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={16} className="text-muted-foreground" />
        </div>
      )}

      {!isPreview && (
        <button
          type="button"
          onClick={handleRemoveClick}
          className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs group-hover:flex"
        >
          <X size={12} />
        </button>
      )}

      <div className={!isPreview ? "pl-5" : ""}>
        <ComponentPreview component={component} />
      </div>
    </div>
  );
}

function ComponentPreview({ component }: { component: IQComponent }) {
  switch (component.type) {
    case "heading": {
      const Tag = `h${component.level}` as keyof JSX.IntrinsicElements;
      const sizes = { 1: "text-2xl", 2: "text-xl", 3: "text-lg", 4: "text-base" };
      return <Tag className={`font-bold ${sizes[component.level]}`}>{component.text}</Tag>;
    }
    case "paragraph":
      return <p className="text-sm text-muted-foreground">{component.text}</p>;
    case "infoCard": {
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
    case "image":
      return (
        <div className="flex h-24 items-center justify-center rounded bg-muted text-sm text-muted-foreground">
          {component.src ? (
            <img src={component.src} alt={component.alt} className="max-h-full object-contain" />
          ) : (
            `[Image: ${component.alt}]`
          )}
        </div>
      );
    case "icon":
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          [{component.iconName}] {component.label}
        </div>
      );
    case "textInput":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            {component.placeholder}
          </div>
        </div>
      );
    case "numberInput":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            {component.placeholder}
          </div>
        </div>
      );
    case "dropdown":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            {component.placeholder}
            <span>&#9662;</span>
          </div>
        </div>
      );
    case "multiSelect":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            {component.placeholder}
            <span>&#9662;</span>
          </div>
        </div>
      );
    case "radioGroup":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className={`flex gap-3 ${component.layout === "vertical" ? "flex-col" : "flex-row"}`}>
            {component.options.map((opt) => (
              <div key={opt.value} className="flex items-center gap-1.5 text-sm">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      );
    case "datePicker":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            {component.placeholder}
          </div>
        </div>
      );
    case "timePicker":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            {component.placeholder}
          </div>
        </div>
      );
    case "scale":
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{component.label}</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{component.min}</span>
            <div className="h-2 flex-1 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">{component.max}</span>
          </div>
        </div>
      );
    case "toggleSwitch":
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{component.label}</label>
          <div className={`h-6 w-10 rounded-full ${component.defaultValue ? "bg-primary" : "bg-muted"}`}>
            <div className={`h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${component.defaultValue ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
        </div>
      );
    case "button": {
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
    default:
      return <div className="text-sm text-muted-foreground">{component.label}</div>;
  }
}
