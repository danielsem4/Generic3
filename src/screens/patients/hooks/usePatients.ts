import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import type { IUser } from "@/common/Users";

interface IPatientsData {
  filteredUsers: IUser[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function usePatients(): IPatientsData {
  const [searchTerm, setSearchTerm] = useState("");
  const { clinicId, userId } = useAuthStore();

  const { data, isLoading, error } = useUsersQuery(clinicId, userId);
  const users = data ?? [];

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email} ${user.phone_number ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error: error as Error | null,
  };
}
