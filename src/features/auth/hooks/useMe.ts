import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";

export const useMe = () => {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
  };
};
