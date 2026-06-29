import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset, resetPassword } from "@/api/authApi";

export const useRequestPasswordReset = () =>
  useMutation<{ user_id: string }, Error, { email: string }>({
    mutationFn: async (payload) => {
      const res = await requestPasswordReset(payload);
      return res.data;
    },
  });

export const useResetPassword = () =>
  useMutation<unknown, Error, { user_id: string; new_password: string }>({
    mutationFn: async (payload) => {
      const res = await resetPassword(payload);
      return res.data;
    },
  });
