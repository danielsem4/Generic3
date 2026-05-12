import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createVariantElement,
  updateVariantElement,
  deleteVariantElement,
  publishVariantElement,
  type IVariantElementPayload,
  type IVariantElementUpdatePayload,
} from "@/api/measurementsApi";

export function useVariantElementMutations(measurementId: string | undefined) {
  const queryClient = useQueryClient();
  const clinicId = useAuthStore((s) => s.clinicId);

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ["measurement-structure", measurementId],
    });
    queryClient.invalidateQueries({
      queryKey: ["measurement-versions", measurementId],
    });
  }

  const createMutation = useMutation({
    mutationFn: ({
      screenNumber,
      payload,
    }: {
      screenNumber: number;
      payload: IVariantElementPayload;
    }) => createVariantElement(clinicId!, measurementId!, screenNumber, payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      screenNumber,
      elementId,
      payload,
    }: {
      screenNumber: number;
      elementId: string;
      payload: IVariantElementUpdatePayload;
    }) =>
      updateVariantElement(
        clinicId!,
        measurementId!,
        screenNumber,
        elementId,
        payload,
      ),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      screenNumber,
      elementId,
    }: {
      screenNumber: number;
      elementId: string;
    }) =>
      deleteVariantElement(
        clinicId!,
        measurementId!,
        screenNumber,
        elementId,
      ),
    onSuccess: invalidate,
  });

  const publishMutation = useMutation({
    mutationFn: ({
      screenNumber,
      elementId,
    }: {
      screenNumber: number;
      elementId: string;
    }) =>
      publishVariantElement(
        clinicId!,
        measurementId!,
        screenNumber,
        elementId,
      ),
    onSuccess: invalidate,
  });

  return {
    createVariant: createMutation.mutateAsync,
    updateVariant: updateMutation.mutateAsync,
    deleteVariant: deleteMutation.mutateAsync,
    publishVariant: publishMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isPublishing: publishMutation.isPending,
  };
}
