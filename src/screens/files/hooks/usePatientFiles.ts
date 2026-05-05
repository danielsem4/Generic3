import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPatientDetails } from "@/api/usersApi";
import { getPatientFiles, uploadPatientFile } from "@/api/patientFilesApi";

export function usePatientFiles() {
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();

  const {
    data: patientResponse,
    isLoading: isPatientLoading,
    error: patientError,
  } = useQuery({
    queryKey: ["patient", userId],
    queryFn: () => getPatientDetails(userId!),
    enabled: !!userId,
  });

  const clinicId = patientResponse?.clinics?.[0]?.id;

  const {
    data: files = [],
    isLoading: isFilesLoading,
    error: filesError,
  } = useQuery({
    queryKey: ["patient-files", clinicId, userId],
    queryFn: () => getPatientFiles(clinicId!, userId!),
    enabled: !!clinicId && !!userId,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, name }: { file: File; name: string }) =>
      uploadPatientFile(clinicId!, userId!, file, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-files", clinicId, userId],
      });
    },
  });

  return {
    files,
    isLoading: isPatientLoading || isFilesLoading,
    error: patientError || filesError,
    isUploading: uploadMutation.isPending,
    uploadFile: uploadMutation.mutateAsync,
  };
}