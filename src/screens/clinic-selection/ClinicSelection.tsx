import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClinicSelection } from "./hooks/useClinicSelection";

export default function ClinicSelection() {
  const { clinics, isPending, handleSelect } = useClinicSelection();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Select a Clinic</CardTitle>
          <CardDescription>
            Choose the clinic you want to manage in this session.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {clinics.map((clinic) => (
            <Button
              key={clinic.id}
              variant="outline"
              disabled={isPending}
              onClick={() => handleSelect(clinic.id)}
            >
              {clinic.clinic_name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
