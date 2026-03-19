import { useQuery } from "@tanstack/react-query";
import { getClinicManagers } from "@/api/usersApi";

export function useSelectableManagers() {
  const { data: managers = [], isLoading } = useQuery({
    queryKey: ["users", "clinic-managers"],
    queryFn: getClinicManagers,
  });
  return { managers, isLoading };
}
