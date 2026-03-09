import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery"; 
import type { IUser } from "@/common/Users";
import { useUserStore } from "@/store/useUserStore";

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

  const usersFromStore = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  const usersQuery = useUsersQuery(clinicId, userId);
  const users = useUserStore((state) => state.users);

useEffect(() => {
    if (clinicId && userId) {
      fetchUsers(clinicId, userId);
    }
  }, [clinicId, userId, fetchUsers]);

    const filteredUsers = users.filter((user) =>
  `${user.first_name} ${user.last_name} ${user.email} ${user.phone_number ?? ""}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

 return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isLoading: usersQuery.isLoading && usersFromStore.length === 0,
    error: usersQuery.error as Error | null,
  };
}
