import { useState } from "react";
import { usePatientFiles } from "./usePatientFiles";

export function useUploadFileDialog() {
  const { uploadFile, isUploading } = usePatientFiles();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const resetForm = () => {
    setFile(null);
    setFileName("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFileName(nameWithoutExt);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;
    const extension = file.name.split(".").pop();
    const finalName = `${fileName}.${extension}`;
    await uploadFile({ file, name: finalName });
    setOpen(false);
    resetForm();
  };

  return {
    open,
    file,
    fileName,
    isUploading,
    handleOpenChange,
    handleDrop,
    handleFileNameChange,
    handleUpload,
    resetForm,
  };
}
