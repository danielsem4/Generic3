import { useMutation } from "@tanstack/react-query";
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "@/api/authApi";

export const useRequestPasswordReset = () =>
  useMutation<unknown, Error, { email: string }>({
    mutationFn: async (payload) => {
      const res = await requestPasswordReset(payload);
      return res.data;
    },
  });

export const useVerifyResetCode = () =>
  useMutation<unknown, Error, { email: string; code: string }>({
    mutationFn: async (payload) => {
      const res = await verifyResetCode(payload);
      return res.data;
    },
  });

export const useResetPassword = () =>
  useMutation<unknown, Error, { email: string; new_password: string }>({
    mutationFn: async (payload) => {
      const res = await resetPassword(payload);
      return res.data;
    },
  });
