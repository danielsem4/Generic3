import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClinicManagers } from "@/api/usersApi";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUser } from "@/common/Users";

interface IClinicManagersData {
  filteredUsers: IUser[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function useClinicManagers(): IClinicManagersData {
  const [searchTerm, setSearchTerm] = useState("");
  const userId = useAuthStore((s) => s.userId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", "clinic-managers"],
    queryFn: getClinicManagers,
    enabled: !!userId,
  });

  const users = data ?? [];
  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email} ${user.phone_number ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return { filteredUsers, searchTerm, setSearchTerm, isLoading, error: error as Error | null };
}
