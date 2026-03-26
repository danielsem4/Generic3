import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import type { IClinic } from "@/common/types/clinic";
import { Switch } from "@/components/ui/switch";
import { Save, Link, Image} from "lucide-react";
import { useClinicEditCard } from "../hooks/useClinicEditCard";
import { ClinicImage } from "./ClinicImage";


interface ClinicEditCardProps {
  clinic: IClinic;
  onCancel: () => void;
  onSave: (data: Partial<IClinic>) => void;
}

export const ClinicEditCard: React.FC<ClinicEditCardProps> = ({
  clinic,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();

  const {
    name,setName,
    url,setUrl,
    imageUrl,setImageUrl,
    isResearch,setIsResearch,
    handleSave,
  } = useClinicEditCard({ clinic, onSave });

  return (
  <Card className="lg:col-span-2 overflow-hidden border-none shadow-md bg-card flex flex-col md:flex-row min-h-87.5 rounded-xl relative">
      
      <ClinicImage
               src={imageUrl}
               alt={name}
               isResearch={isResearch}
              />

      <div className="p-8 md:p-12 flex-1 flex flex-col justify-between">

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {t("Cancel")}
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-0 h-4 w-4" />
            {t("Save")}
          </Button>
        </div>

        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium">
              {t("Clinic Name")}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="inline-flex items-center gap-1 text-sm font-medium">
              <Link className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t("Website URL")}</span>
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="inline-flex items-center gap-1 text-sm font-medium">
              <Image className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>{t("Image URL")}</span>
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Research Facility</p>
              <p className="text-sm text-muted-foreground">
                Enable research tracking features
              </p>
            </div>

            <Switch
              checked={isResearch}
              onCheckedChange={setIsResearch}
            />
          </div>
        </div> 
      </div> 
    </Card>
);
};