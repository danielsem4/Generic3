import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, GitBranch, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { IQComponent } from "@/common/types/measurement";
import type { IServerElement } from "../../lib/transformStructure";
import { useVersionContext } from "./VersionContext";
import { VariantElementForm } from "./VariantElementForm";

const VERSION_KEY_RE = /^[a-zA-Z0-9_-]{1,50}$/;

interface VariantControlsProps {
  component: IQComponent;
  v1Element: IServerElement | undefined;
}

export function VariantControls({ component, v1Element }: VariantControlsProps) {
  const { t } = useTranslation();
  const {
    activeVersionKey,
    versions,
    getVariantForComponent,
    getVariantCountForComponent,
    deleteVariant,
    isDeleting,
  } = useVersionContext();

  const [showVersionPicker, setShowVersionPicker] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [editingVersion, setEditingVersion] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const variantCount = getVariantCountForComponent(component.id);
  const currentVariant = getVariantForComponent(component.id, activeVersionKey);
  const isV1View = activeVersionKey === "v1";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowVersionPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!v1Element) return null;

  function handleSelectVersion(vk: string) {
    setShowVersionPicker(false);
    setCustomKey("");
    setEditingVersion(vk);
  }

  function handleNewVersionSubmit() {
    const key = customKey.trim();
    if (!VERSION_KEY_RE.test(key)) {
      toast.error(t("measurements.builder.versions.invalidKey"));
      return;
    }
    setShowVersionPicker(false);
    setCustomKey("");
    setEditingVersion(key);
  }

  async function handleDeleteVariant(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentVariant) return;
    try {
      await deleteVariant({
        screenNumber: v1Element!._screenNumber ?? v1Element!.row_number,
        elementId: currentVariant.id,
      });
      toast.success(t("measurements.builder.versions.variantDeleted"));
    } catch {
      toast.error(t("measurements.builder.versions.variantDeleteError"));
    }
  }

  const nonV1Versions = versions.filter((v) => v !== "v1");

  return (
    <div className="mt-1">
      {isV1View && variantCount > 0 && (
        <div className="flex items-center gap-1">
          <GitBranch size={11} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {t("measurements.builder.versions.variantCount", { count: variantCount })}
          </span>
        </div>
      )}

      {!isV1View && !currentVariant && (
        <div className="flex items-center gap-2 rounded-md border border-dashed border-muted-foreground/40 px-2 py-1.5 text-xs text-muted-foreground bg-muted/20">
          <span className="italic">
            {t("measurements.builder.versions.noVariant")}
          </span>
          {editingVersion !== activeVersionKey && (
            <button
              type="button"
              onClick={() => setEditingVersion(activeVersionKey)}
              className="ml-auto rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
            >
              {t("measurements.builder.versions.addVariant")}
            </button>
          )}
        </div>
      )}

      {!isV1View && currentVariant && editingVersion !== activeVersionKey && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditingVersion(activeVersionKey)}
            className="text-xs text-primary hover:underline"
          >
            {t("measurements.builder.versions.editVariantBtn")}
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            type="button"
            onClick={handleDeleteVariant}
            disabled={isDeleting}
            className="text-xs text-destructive hover:underline"
          >
            <Trash2 size={11} className="inline" />
          </button>
        </div>
      )}

      {isV1View && (
        <div className="relative inline-block" ref={pickerRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowVersionPicker((v) => !v);
            }}
            className="flex items-center gap-0.5 rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-muted"
            title={t("measurements.builder.versions.addVersionTitle")}
          >
            <Plus size={11} />
            {t("measurements.builder.versions.addVersion")}
          </button>

          {showVersionPicker && (
            <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border bg-popover p-1 shadow-md">
              {nonV1Versions.map((vk) => (
                <button
                  key={vk}
                  type="button"
                  onClick={() => handleSelectVersion(vk)}
                  className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-accent"
                >
                  {vk}
                </button>
              ))}
              {nonV1Versions.length > 0 && (
                <div className="my-1 h-px bg-border" />
              )}
              <div className="flex gap-1 px-1 py-1">
                <input
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNewVersionSubmit()}
                  placeholder={t("measurements.builder.versions.newKeyPlaceholder")}
                  className="min-w-0 flex-1 rounded border bg-background px-2 py-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={handleNewVersionSubmit}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium",
                    customKey.trim()
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed",
                  )}
                >
                  {t("common.add")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {editingVersion && (
        <VariantElementForm
          v1Element={v1Element}
          existingVariant={getVariantForComponent(component.id, editingVersion)}
          versionKey={editingVersion}
          screenNumber={v1Element._screenNumber ?? 1}
          onDone={() => setEditingVersion(null)}
        />
      )}
    </div>
  );
}
