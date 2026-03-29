import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useModules } from "../hooks/useModules";
import { ModulesTable } from "./ModulesTable";
import type { IModule } from "@/common/types/patientDetails";

export function ReadOnlyModulesView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filteredItems, isLoading, error, searchTerm, handleSearchChange } = useModules();

  const handleView = (module: IModule) => {
    const slug = module.module_name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/modules/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{t("home.error")}</p>
      </div>
    );
  }

  const modules: IModule[] = filteredItems.map((item) => ({
    id: item.id,
    module_name: item.module_name,
    module_description: item.module_description,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">{t("modules.title")}</h1>
        <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
      </div>

      <ModulesTable
        modules={modules}
        role={null}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onView={handleView}
      />
    </div>
  );
}
