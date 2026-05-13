import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GitBranch, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VERSION_KEY_RE = /^[a-zA-Z0-9_-]{1,50}$/;

interface VersionControlPanelProps {
  versions: string[];
  activeVersion: string;
  onVersionChange: (vk: string) => void;
  onBranchNew: (key?: string) => void;
  isBusy: boolean;
  isLocked?: boolean;
}

export function VersionControlPanel({
  versions,
  activeVersion,
  onVersionChange,
  onBranchNew,
  isBusy,
  isLocked,
}: VersionControlPanelProps) {
  const { t } = useTranslation();
  const [versionKeyInput, setVersionKeyInput] = useState("");
  const [keyError, setKeyError] = useState(false);

  function handleBranchClick() {
    if (isLocked) {
      console.log("If");

      const key = versionKeyInput.trim();
      if (!VERSION_KEY_RE.test(key)) {
        setKeyError(true);
        return;
      }
      setKeyError(false);
      setVersionKeyInput("");
      onBranchNew(key);
    } else {
      console.log("Else");

      onBranchNew();
    }
  }

  return (
    <div className="rounded-lg border bg-muted/40 p-3 space-y-2.5">
      <div className="flex items-center gap-1.5">
        {isLocked ? (
          <Lock size={13} className="text-amber-500" />
        ) : (
          <GitBranch size={13} className="text-muted-foreground" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {isLocked
            ? t("measurements.builder.versions.lockedMode")
            : t("measurements.builder.versions.versionControl")}
        </span>
      </div>

      <select
        value={activeVersion}
        onChange={(e) => onVersionChange(e.target.value)}
        className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm font-mono"
      >
        {versions.map((vk) => (
          <option key={vk} value={vk}>
            {vk}
          </option>
        ))}
      </select>

      {isLocked && (
        <div className="space-y-1">
          <Label className="text-xs">
            {t("measurements.builder.versions.versionKeyLabel")}
          </Label>
          <Input
            value={versionKeyInput}
            onChange={(e) => {
              setVersionKeyInput(e.target.value);
              setKeyError(false);
            }}
            placeholder={t("measurements.builder.versions.newKeyPlaceholder")}
            className={`h-8 text-sm font-mono ${keyError ? "border-destructive" : ""}`}
          />
          {keyError && (
            <p className="text-xs text-destructive">
              {t("measurements.builder.versions.invalidKey")}
            </p>
          )}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full h-7 gap-1.5 text-xs"
        onClick={handleBranchClick}
        disabled={isBusy}
      >
        <GitBranch size={12} />
        {t("measurements.builder.versions.branchNew")}
      </Button>
    </div>
  );
}
