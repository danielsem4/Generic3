import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ISafeUser } from "@/common/types/User";

interface AuthStore {
  clinicId: number | null;
  userId: string | null;
  firstName: string | null;
  isAdmin: boolean;
  isClinicManager: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  setAuthUser: (user: ISafeUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      clinicId: null,
      userId: null,
      firstName: null,
      isAdmin: false,
      isClinicManager: false,
      isDoctor: false,
      isPatient: false,
      setAuthUser: (user: ISafeUser) =>
        set({
          clinicId: user.clinicId,
          userId: user.id,
          firstName: user.firstName,
          isAdmin: user.isAdmin,
          isClinicManager: user.isClinicManager,
          isDoctor: user.isDoctor,
          isPatient: user.isPatient,
        }),
      logout: () => {
        set({
          clinicId: null,
          userId: null,
          firstName: null,
          isAdmin: false,
          isClinicManager: false,
          isDoctor: false,
          isPatient: false,
        });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "auth-store",
      version: 3,
      migrate: () => ({
        clinicId: null,
        userId: null,
        firstName: null,
        isAdmin: false,
        isClinicManager: false,
        isDoctor: false,
        isPatient: false,
      }),
      partialize: (state) => ({
        clinicId: state.clinicId,
        userId: state.userId,
        firstName: state.firstName,
        isAdmin: state.isAdmin,
        isClinicManager: state.isClinicManager,
        isDoctor: state.isDoctor,
        isPatient: state.isPatient,
      }),
    },
  ),
);
