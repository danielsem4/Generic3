import { create } from "zustand";
import { getUsers } from "@/api/usersApi";
import type { IAuthUser } from "@/common/types/User";

interface UserStore {
  users: IAuthUser[];
  fetchUsers: (clinicId: string, otherParam?: unknown) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  fetchUsers: async (clinicId: string, otherParam?: unknown) => {
    const data = await getUsers(clinicId, otherParam as string);
    set({ users: data });
  },
}));
export { getUsers };

