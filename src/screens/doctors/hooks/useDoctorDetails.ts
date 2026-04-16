import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDoctorDetails } from "@/api/usersApi";

export function useDoctorDetails() {
  const { userId } = useParams<{ userId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["doctor", userId],
    queryFn: () => getDoctorDetails(userId!),
    enabled: !!userId,
  });

  const doctor = data
    ? {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone_number ?? "",
        role: data.role,
        clinicName: data.clinics[0]?.clinic_name ?? "",
      }
    : null;

  return { doctor, isLoading, error };
}
