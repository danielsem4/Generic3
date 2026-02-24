import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ISafeUser } from "@/common/types/User";

interface AuthStore {
  clinicId: number | null;
  userId: number | null;
  setAuthUser: (user: ISafeUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      clinicId: null,
      userId: null,
      setAuthUser: (user: ISafeUser) =>
        set({
          clinicId: user.clinicId,
          userId: Number(user.id),
        }),
      logout: () => {
        set({ clinicId: null, userId: null });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "auth-store",
      version: 1,
      partialize: (state) => ({
        clinicId: state.clinicId,
        userId: state.userId,
      }),
    },
  ),
);
