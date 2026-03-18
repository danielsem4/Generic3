import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Upload, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { ClinicFormValues } from "../../Schema/clinicSchema";

interface Props {
  form: UseFormReturn<ClinicFormValues>;
}

export function Step1BasicInfo({ form }: Props) {
  const { t } = useTranslation();
  const { register, watch, setValue, formState: { errors } } = form;
  const clinicType = watch("clinicType");
  const logoFile = watch("clinicLogoFile");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!(logoFile instanceof File)) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const applyFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setValue("clinicLogoFile", file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) applyFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const clearLogo = () => {
    setValue("clinicLogoFile", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fieldClass = (hasError: boolean) =>
    hasError
      ? "border-destructive focus-visible:ring-destructive"
      : "border-border bg-background focus-visible:ring-primary";

  return (
    <div className="space-y-4">
      {/* Clinic Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground flex items-center gap-1">
          {t("clinicManagers.clinicNameLabel")}
          <span className="text-destructive">*</span>
        </label>
        <Input
          {...register("clinicName")}
          placeholder={t("clinicManagers.clinicNamePlaceholder")}
          className={fieldClass(!!errors.clinicName)}
        />
        {errors.clinicName && (
          <p className="text-[10px] text-destructive font-medium leading-none">
            {t(errors.clinicName.message as string)}
          </p>
        )}
      </div>

      {/* Clinic URL */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground flex items-center gap-1">
          {t("clinicManagers.clinicUrlLabel")}
          <span className="text-destructive">*</span>
        </label>
        <Input
          {...register("clinicUrl")}
          type="url"
          placeholder={t("clinicManagers.clinicUrlPlaceholder")}
          className={fieldClass(!!errors.clinicUrl)}
        />
        {errors.clinicUrl && (
          <p className="text-[10px] text-destructive font-medium leading-none">
            {t(errors.clinicUrl.message as string)}
          </p>
        )}
      </div>

      {/* Clinic Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground">
          {t("clinicManagers.clinicTypeLabel")}
        </label>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["STANDARD", "RESEARCH"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("clinicType", type)}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold transition-colors",
                clinicType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {t(`clinicManagers.type${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground">
          {t("clinicManagers.clinicLogoLabel")}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {previewUrl ? (
          <div className="relative w-full h-28 rounded-lg border border-border overflow-hidden">
            <img
              src={previewUrl}
              alt="logo preview"
              className="w-full h-full object-contain bg-muted/30"
            />
            <button
              type="button"
              onClick={clearLogo}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background border border-border transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full h-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30",
            )}
          >
            <div className={cn("p-2 rounded-full", isDragging ? "bg-primary/10" : "bg-muted")}>
              {isDragging
                ? <ImageIcon className="w-5 h-5 text-primary" />
                : <Upload className="w-5 h-5 text-muted-foreground" />
              }
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {t("clinicManagers.logoUploadTitle")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("clinicManagers.logoUploadHint")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
