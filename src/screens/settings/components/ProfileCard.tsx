import { useTranslation } from "react-i18next";
import {
  Phone,
  Shield,
  ShieldCheck,
  Calendar,
  Building2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/common/UserAvatar";

interface ProfileCardProps {
  initials: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  isActive: boolean;
  is2FAEnabled: boolean;
  memberSince: string;
  currentClinicName: string;
  clinicCount: number;
}

export function ProfileCard(props: ProfileCardProps) {
  const { t } = useTranslation();

  const roleLabel =
    t(`settings.profile.roles.${props.role}` as never) ?? props.role;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <UserAvatar initials={props.initials} size="lg" />
        <div>
          <h3 className="text-xl font-bold">{props.fullName}</h3>
          <p className="text-sm text-muted-foreground">{props.email}</p>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileDetailRow
            icon={<Phone className="h-4 w-4" />}
            label={t("settings.profile.phone")}
            value={props.phoneNumber ?? t("common.na")}
          />

          <ProfileDetailRow
            icon={<Shield className="h-4 w-4" />}
            label={t("settings.profile.role")}
          >
            <Badge variant="secondary">{roleLabel}</Badge>
          </ProfileDetailRow>

          <ProfileDetailRow
            icon={<ShieldCheck className="h-4 w-4" />}
            label={t("settings.profile.accountStatus")}
          >
            <Badge variant={props.isActive ? "default" : "destructive"}>
              {props.isActive
                ? t("settings.profile.active")
                : t("settings.profile.inactive")}
            </Badge>
          </ProfileDetailRow>

          <ProfileDetailRow
            icon={<ShieldCheck className="h-4 w-4" />}
            label={t("settings.profile.twoFA")}
          >
            <Badge variant={props.is2FAEnabled ? "default" : "outline"}>
              {props.is2FAEnabled
                ? t("settings.profile.enabled")
                : t("settings.profile.disabled")}
            </Badge>
          </ProfileDetailRow>

          <ProfileDetailRow
            icon={<Calendar className="h-4 w-4" />}
            label={t("settings.profile.memberSince")}
            value={props.memberSince}
          />

          <ProfileDetailRow
            icon={<Building2 className="h-4 w-4" />}
            label={t("settings.profile.currentClinic")}
            value={props.currentClinicName || t("common.na")}
          />

          <ProfileDetailRow
            icon={<Users className="h-4 w-4" />}
            label={t("settings.profile.associatedClinics")}
            value={t("settings.profile.clinicCount", {
              count: props.clinicCount,
            })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileDetailRow({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        {children ?? <p className="text-sm font-medium">{value}</p>}
      </div>
    </div>
  );
}
