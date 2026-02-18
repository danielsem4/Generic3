import { useQuery } from "@tanstack/react-query";

export const useHomeData = () => {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      const storedUser = localStorage.getItem("authUser");

      if (!storedUser) {
        throw new Error("User not found");
      }

      const parsed = JSON.parse(storedUser);

      const clinicId = parsed.user.clinicId;
      const userId = parsed.user.id;

     const response = await fetch(
  `${import.meta.env.VITE_API_URL_DEV}users/${clinicId}/user/${userId}/`
);


      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      return response.json();
    },
  });
};
