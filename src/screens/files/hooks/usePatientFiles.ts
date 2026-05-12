import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getPatientDetails } from "@/api/usersApi";
import { getPatientFiles, uploadPatientFile } from "@/api/patientFilesApi";
import { viewFile, downloadFile } from "../utils/fileHandlers";

export function usePatientFiles() {
  const { userId } = useParams<{ userId: string }>();
  const { clinicId } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: patientResponse,
    isLoading: isPatientLoading,
  } = useQuery({
    queryKey: ["patient", userId],
    queryFn: () => getPatientDetails(userId!),
    enabled: !!userId,
  });

  const patientClinicId = patientResponse?.clinics?.[0]?.id;

  const {
    data: files = [],
    isLoading: isFilesLoading,
  } = useQuery({
    queryKey: ["patient-files", patientClinicId, userId],
    queryFn: () => getPatientFiles(patientClinicId!, userId!),
    enabled: !!patientClinicId && !!userId,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, name }: { file: File; name: string }) =>
      uploadPatientFile(patientClinicId!, userId!, file, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-files", patientClinicId, userId],
      });
    },
  });

  const filteredFiles = files.filter((file) =>
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewFile = (fileId: string, fileName: string) => {
    if (clinicId && userId) {
      viewFile(clinicId, userId, fileId, fileName);
    }
  };

  const handleDownloadFile = (fileId: string, fileName: string) => {
    if (clinicId && userId) {
      downloadFile(clinicId, userId, fileId, fileName);
    }
  };

  return {
    userId,
    files: filteredFiles,
    searchQuery,
    handleSearchChange,
    handleViewFile,
    handleDownloadFile,
    isLoading: isPatientLoading || isFilesLoading,
    isUploading: uploadMutation.isPending,
    uploadFile: uploadMutation.mutateAsync,
  };
}
