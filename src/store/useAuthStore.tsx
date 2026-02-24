import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IAuthUser } from "@/common/types/User";

interface AuthStore {
  clinicId: number | null;
  userId: number | null;
  setAuthUser: (user: IAuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      clinicId: null,
      userId: null,
      setAuthUser: (user: IAuthUser) =>
        set({
          clinicId: user.clinicId,
          userId: Number(user.id),
        }),
      logout: () =>
        set({
          clinicId: null,
          userId: null,
        }),
    }),
    {
      name: "auth-store",
      version: 1,
      partialize: (state) => ({
        clinicId: state.clinicId,
        userId: state.userId,
      }),
    }
  )
);
