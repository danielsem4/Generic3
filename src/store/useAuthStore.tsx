import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ISafeUser, IClinic } from "@/common/types/User";
import type { UserRole } from "@/common/types/Role";

interface AuthStore {
  clinicId: string | null;
  clinicName: string;
  clinicImage: string | null;
  clinics: IClinic[];
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole | null;
  setAuthUser: (user: ISafeUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      clinicId: null,
      clinicName: "",
      clinicImage: null,
      clinics: [],
      userId: null,
      firstName: null,
      lastName: null,
      role: null,
      setAuthUser: (user: ISafeUser) =>
        set({
          clinicId: user.clinicId,
          clinicName: user.clinicName,
          clinicImage: user.clinicImage,
          clinics: user.clinics,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }),
      logout: () =>
        set({
          clinicId: null,
          clinicName: "",
          clinicImage: null,
          clinics: [],
          userId: null,
          firstName: null,
          lastName: null,
          role: null,
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        clinicId: state.clinicId,
        userId: state.userId,
      }),
    },
  ),
);
