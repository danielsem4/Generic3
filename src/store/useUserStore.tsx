import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUsers } from "@/api/usersApi";
import axios from "axios";
import type { IAppointment, IUser, IUserModule } from "@/common/Users";

interface UserStore {
  users: IUser[];
  clinicId: number | null;
  userId: number | null;
  modules: IUserModule[];       
  appointments: IAppointment[];  
  setClinicId: (id: number) => void;
  setUserId: (id: number) => void;
  fetchUsers: () => Promise<void>;
  fetchModules: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(persist((set, get) => ({  
  users: [],
  clinicId: null,
  userId: null,
  modules: [] as IUserModule[],     
      appointments: [] as IAppointment[],   
  setClinicId: (id: number) => set({ clinicId: id }),
  setUserId: (id: number) => set({ userId: id }),

  fetchUsers: async () => {
    const { clinicId, userId } = get();
    if (!clinicId || !userId) {
      console.error("Missing clinicId or userId");
      return;
    }
    try {
          const data: IUser[] = await getUsers(clinicId, userId); 
          set({ users: data });
        } catch (error) {
          console.error("Store error:", error);
          set({ users: [] });
        }
      },

  fetchModules: async () => {
    try {
     const response = await axios.get<IUserModule[]>("/api/v1/modules", { withCredentials: true });      
     set({ modules: response.data });
    } catch (error) {
      console.error("Store error (modules):", error);
    }
  },

  fetchAppointments: async () => {
    try {
      const response = await axios.get<IAppointment[]>("/api/v1/appointments", { withCredentials: true });
      set({ appointments: response.data });     
    } catch (error) {
      console.error("Store error (appointments):", error);
      console.warn("Appointments API not found, skipping fetch.");
    set({ appointments: [] }); 
    }
  },
}), {
  name: "user-store", 
}));
