import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail, Phone, Building2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDoctorDetails } from "./hooks/useDoctorDetails";

export default function DoctorDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { doctor, isLoading, error } = useDoctorDetails();

  function handleBack() {
    navigate("/doctors");
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground font-medium">
        {t("home.loading")}
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="p-10 text-center text-destructive font-medium">
        {t("doctors.detailError")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("doctors.backToDirectory")}
        </button>

        <Card className="w-full rounded-xl p-6">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-bold text-primary">
                {doctor.firstName?.[0] ?? ""}
                {doctor.lastName?.[0] ?? ""}
              </div>

              <div className="text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h2>
                {doctor.clinicName && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{doctor.clinicName}</span>
                  </div>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <Pencil className="h-3.5 w-3.5" />
              {t("patient.editDetails")}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("patient.phone")}
                </div>
                <div className="font-medium">{doctor.phone || "—"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("patient.email")}
                </div>
                <div className="font-medium">{doctor.email}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
