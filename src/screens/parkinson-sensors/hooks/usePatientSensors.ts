import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPatientDetails } from "@/api/usersApi";
import { getPatientSensorEvents } from "@/api/parkinsonSensorsApi";

export function usePatientSensors() {
  const { userId } = useParams<{ userId: string }>();

  const patientQuery = useQuery({
    queryKey: ["patient", userId],
    queryFn: () => getPatientDetails(userId!),
    enabled: Boolean(userId),
  });

  const clinicId = patientQuery.data?.clinics?.[0]?.id;

  const eventsQuery = useQuery({
    queryKey: ["patient-sensor-events", clinicId, userId],
    queryFn: () => getPatientSensorEvents(clinicId!, userId!),
    enabled: Boolean(clinicId && userId),
    retry: false,
  });

  return {
    data: eventsQuery.data ?? [],
    isLoading: patientQuery.isLoading || eventsQuery.isLoading,
    error: patientQuery.error || eventsQuery.error,
  };
}
