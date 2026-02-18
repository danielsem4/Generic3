import { create } from "zustand";
import { getUsers } from "@/api/usersApi";
import type { IAuthUser } from "@/common/types/User";

interface UserStore {
  users: IAuthUser[];
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  fetchUsers: async () => {
    try {
    const data = await getUsers();
    set({ users: data });
  } catch (error) {
    console.error("Store error:", error);
  }
  },
}   ));
export { getUsers };