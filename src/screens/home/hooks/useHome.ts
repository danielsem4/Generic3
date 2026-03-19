import { useAuthStore } from "@/store/useAuthStore";
import { useRoleUsersQuery } from "@/hooks/queries/useRoleUsersQuery";
import { useModulesQuery } from "@/hooks/queries/useModulesQuery";
import { useRole } from "@/hooks/common/useRole";
import type { IUser, IUserModule } from "@/common/Users";
import type { UserRole } from "@/common/types/Role";

interface IHomeData {
  role: UserRole;
  users: IUser[];
  modules: IUserModule[];
  isLoading: boolean;
  error: Error | null;
}

export function useHome(): IHomeData {
  const { userId } = useAuthStore();
  const role = useRole();

  const isLoggedIn = !!userId;

  const usersQuery = useRoleUsersQuery(role, isLoggedIn);
  const modulesQuery = useModulesQuery(isLoggedIn);

  return {
    role,
    users: usersQuery.data ?? [],
    modules: modulesQuery.data ?? [],
    isLoading: usersQuery.isLoading || modulesQuery.isLoading,
    error: (usersQuery.error || modulesQuery.error) as Error | null,
  };
}
