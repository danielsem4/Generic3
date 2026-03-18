import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUser } from "@/common/Users";

interface IFilteredUsersData {
  filteredUsers: IUser[];
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  error: Error | null;
}

export function useFilteredUsers(
  queryKey: readonly string[],
  queryFn: () => Promise<IUser[]>,
): IFilteredUsersData {
  const [searchTerm, setSearchTerm] = useState("");
  const userId = useAuthStore((s) => s.userId);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKey],
    queryFn,
    enabled: !!userId,
  });

  const users = data ?? [];
  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email} ${user.phone_number ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    filteredUsers,
    searchTerm,
    handleSearchChange,
    isLoading,
    error: error as Error | null,
  };
}
