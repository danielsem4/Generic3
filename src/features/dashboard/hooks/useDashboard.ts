import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/dashboard.api";

export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard", "users"],
    queryFn: getUsers,
  });
