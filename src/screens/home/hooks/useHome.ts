import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import { useModulesQuery } from "@/hooks/queries/useModulesQuery";
import type { IUser, IUserModule } from "@/common/Users";

interface IHomeData {
  sidebarOpen: boolean;
  handleToggleSidebar: () => void;
  users: IUser[];
  modules: IUserModule[];
  isLoading: boolean;
  error: Error | null;
}

export function useHome(): IHomeData {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { clinicId, userId } = useAuthStore();

  const isAuthenticated = !!clinicId && !!userId;

  const usersQuery = useUsersQuery(clinicId, userId);
  const modulesQuery = useModulesQuery(isAuthenticated);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  return {
    sidebarOpen,
    handleToggleSidebar,
    users: usersQuery.data ?? [],
    modules: modulesQuery.data ?? [],
    isLoading: usersQuery.isLoading || modulesQuery.isLoading,
    error: (usersQuery.error || modulesQuery.error) as Error | null,
  };
}
