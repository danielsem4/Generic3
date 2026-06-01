import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Mail, Phone, Calendar, Building2 } from "lucide-react";
import type { IEntityHeader } from "@/common/types/entityHeader";

interface Props {
  data: IEntityHeader;
  renderActions?: React.ReactNode; 
}

export default function EntityHeader({ data, renderActions }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="w-full rounded-xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-bold text-primary">
            {data.firstName?.[0] ?? ""}
            {data.lastName?.[0] ?? ""}
          </div>

          <div className="text-left">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {data.firstName} {data.lastName}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{data.clinicName}</span>
            </div>
          </div>
        </div>

        {renderActions}
      </div>

      <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">
              {t("patient.createdDate")}
            </div>
            <div className="font-medium">{data.joinedAt}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">
              {t("patient.phone")}
            </div>
            <div className="font-medium">{data.phone}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">
              {t("patient.email")}
            </div>
            <div className="font-medium">{data.email}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}