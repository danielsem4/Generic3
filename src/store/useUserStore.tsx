import { create } from "zustand";
import { getUsers } from "@/api/usersApi";
import type { IUser } from "@/common/Users";

interface UserStore {
  users: IUser[];
  fetchUsers: (clinicId: number, userId: number) => Promise<void>;
  addUser: (newUser: IUser) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],

  fetchUsers: async (clinicId, userId) => {
    try {
    const data = await getUsers(clinicId, userId);
    set({ users: data });
  } catch (error) {
    console.error("Store error:", error);
  }
  },
  addUser: (newUser) => 
    set((state) => ({ 
      users: [newUser, ...state.users] 
    })),
}));

export { getUsers };

