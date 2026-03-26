import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Globe, Calendar} from "lucide-react"; 
import { useTranslation } from "react-i18next";
import type { IClinic } from "@/common/types/clinic";

interface ClinicInfoCardProps {
  clinic: IClinic;
  isManager: boolean;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  isLink?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, isLink }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 text-primary">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">
        {label}
      </p>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline block truncate">
          {value.replace("https://", "")}
        </a>
      ) : (
        <p className="text-sm font-bold text-foreground truncate">
          {value || "N/A"}
        </p>
      )}
    </div>
  </div>
);

export const ClinicInfoCard: React.FC<ClinicInfoCardProps> = ({ clinic, isManager }) => {
  const { t } = useTranslation();

  return (
    <Card className="lg:col-span-2 overflow-hidden border-none shadow-md bg-card flex flex-col md:flex-row min-h-[350px] rounded-xl relative">
      
      <div className="relative w-full md:w-2/5 overflow-hidden shrink-0">
        <img 
          src={clinic.clinic_image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000"} 
          alt="Clinic" 
          className="w-full h-full object-cover" 
        />
        {clinic.is_research && (
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-border">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">
              {t("clinic.researchFacility")}
            </span>
          </div>
        )}
      </div>

      <div className="p-8 md:p-12 flex-1 flex flex-col justify-between relative">
        
        {isManager && (
          <div className="absolute top-6 right-6 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg font-bold text-xs gap-2 border-border hover:bg-secondary transition-colors shadow-sm bg-background/50 backdrop-blur-sm"
            >
              <Edit3 size={14} /> {t("common.editClinic")}
            </Button>
          </div>
        )}

        <div className="text-left mt-4">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
            {t("clinic.locationLabel")}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight max-w-[80%]">
            {clinic.name || t("clinic.defaultName")}
          </h2>
        </div>

        <div className="space-y-6 text-left mt-8">
          <InfoItem 
            icon={<Globe size={20}/>} 
            label={t("clinic.portalLabel")} 
            value={clinic.clinic_url} 
            isLink 
          />
          <InfoItem 
            icon={<Calendar size={20}/>} 
            label={t("clinic.establishedLabel")} 
            value={clinic.created_at ? new Date(clinic.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : t("common.na")} 
          />
        </div>
      </div>
    </Card>
  );
};