import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, CloudUpload } from "lucide-react";
import { useUploadFileDialog } from "../hooks/useUploadFileDialog";

export const UploadFileDialog = () => {
  const { t } = useTranslation();
  const {
    open,
    file,
    fileName,
    isUploading,
    handleOpenChange,
    handleDrop,
    handleFileNameChange,
    handleUpload,
    resetForm,
  } = useUploadFileDialog();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/msword": [".doc", ".docx"],
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm">
          <Upload className="w-4 h-4" />
          {t("files.upload_button")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground text-left">
            {t("files.dialog_title")}
          </DialogTitle>
          <DialogDescription className="text-left text-xs text-muted-foreground">
            {t("files.dialog_desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-left">
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${
                isDragActive
                  ? "border-primary bg-accent"
                  : "border-border hover:border-muted-foreground/40 bg-card"
              }`}
            >
              <input {...getInputProps()} />
              <div className="bg-accent p-4 rounded-full">
                <CloudUpload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">
                  {t("files.drag_drop")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("files.supported_formats")}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-2 rounded-xl font-semibold border-border text-foreground bg-card shadow-sm"
              >
                {t("files.browse")}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center justify-center gap-3 p-6 bg-card rounded-2xl border border-border shadow-inner">
                <div className="bg-accent p-4 rounded-full">
                  <CloudUpload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center overflow-hidden w-full">
                  <p className="text-base font-semibold text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium uppercase">
                    {t("files.size", {
                      size: (file.size / 1024 / 1024).toFixed(2),
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={resetForm}
                  className="text-primary hover:text-primary/80 font-semibold text-sm h-auto p-0"
                >
                  {t("files.choose_different")}
                </Button>
              </div>

              <div className="space-y-2 px-1">
                <label className="text-sm font-semibold text-foreground">
                  {t("files.save_as")}
                </label>
                <Input
                  value={fileName}
                  onChange={handleFileNameChange}
                  className="rounded-xl border-border bg-background focus:ring-ring focus:border-primary font-medium"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button
            variant="ghost"
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-xl font-semibold text-muted-foreground hover:bg-muted"
          >
            {t("common.cancel")}
          </Button>
          <Button
            disabled={!file || isUploading}
            onClick={handleUpload}
            className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px] shadow-sm disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("common.upload_file")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
