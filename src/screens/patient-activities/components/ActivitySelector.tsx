import React, { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Search, Activity, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IClinicActivity} from "@/common/types/activities";

interface ActivitySelectorProps {
  activities: IClinicActivity[];
  selectedActivity: IClinicActivity | null;
  setSelectedActivity: (activity: IClinicActivity | null) => void;
}

export const ActivitySelector = ({
  activities,
  selectedActivity,
  setSelectedActivity,
}: ActivitySelectorProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const results = activities.filter(
    (activity) =>
      activity.activity_name.toLowerCase().includes(query.toLowerCase()) &&
      query.length > 0,
  );

  const handleSelect = (activity: IClinicActivity) => {
    setSelectedActivity(activity);
    setQuery("");
  };

  const handleClear = () => {
    setSelectedActivity(null);
  };

  return (
    <Card className="p-8 border-none shadow-md rounded-[2rem] bg-card relative overflow-visible">
      <label className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
        <Activity size={14} /> {t("patientActivities.activityLabel")}
      </label>

      {selectedActivity ? (
        <div className="bg-primary/10 p-6 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Activity className="text-primary" size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-foreground">
                {selectedActivity.activity_name}
              </h4>
              <p className="text-sm text-muted-foreground font-medium">
                {selectedActivity.activity_description ?? t("patientActivities.defaultSubtitle")}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleClear}>
            <X size={20} />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={22}
          />
          <Input
            value={query}
            onChange={handleSearchChange}
            placeholder={t("patientActivities.searchPlaceholder")}
            className="pl-14 bg-secondary border-none h-16 rounded-2xl text-lg"
          />
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-[110] bg-card border shadow-2xl rounded-2xl mt-1 overflow-hidden">
              {results.map((activity) => (
                <button
                  key={activity.id}
                  className="w-full text-left p-4 hover:bg-secondary border-b last:border-none font-medium"
                  onClick={() => handleSelect(activity)}
                >
                  <span className="font-bold">{activity.activity_name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {activity.activity_description ?? t("patientActivities.defaultSubtitle")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};