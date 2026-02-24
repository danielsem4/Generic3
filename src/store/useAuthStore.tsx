import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IAuthUser } from "@/common/types/User";

interface AuthStore {
  clinicId: number | null;
  userId: number | null;
  authUser: IAuthUser | null;
  setAuthUser: (user: IAuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      clinicId: null,
      userId: null,
      authUser: null,
      setAuthUser: (user: IAuthUser) =>
        set({
          authUser: user,
          clinicId: user.clinicId,
          userId: Number(user.id),
        }),
      logout: () =>
        set({
          authUser: null,
          clinicId: null,
          userId: null,
        }),
    }),
    {
      name: "auth-store",
    }
  )
);
