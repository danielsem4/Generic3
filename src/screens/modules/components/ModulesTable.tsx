import { useTranslation } from "react-i18next";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IModule } from "@/common/types/patientDetails";
import type { UserRole } from "@/common/types/Role";
import { getModuleConfig } from "../moduleConfig";
import { ACCENT_STYLES } from "./accentStyles";

interface Props {
  modules: IModule[];
  role: UserRole | null;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: (module: IModule) => void;
  onDelete?: (module: IModule) => void;
}

const hasActions = (role: UserRole | null) =>
  role === "ADMIN" || role === "CLINIC_MANAGER";

export function ModulesTable({ modules, role, searchTerm, onSearchChange, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const showActions = hasActions(role);
  const colSpan = showActions ? 4 : 3;

  return (
    <Card className="shadow-md border-none ring-1 ring-border bg-card">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder={t("modules.searchPlaceholder")}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="w-12" />
              <TableHead className="font-bold text-foreground">{t("modules.columnName")}</TableHead>
              <TableHead className="font-bold text-foreground hidden md:table-cell">
                {t("modules.columnDescription")}
              </TableHead>
              {showActions && (
                <TableHead className="font-bold text-foreground text-right w-24">
                  {t("modules.columnActions")}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.length > 0 ? (
              modules.map((module) => {
                const normalizedName = module.module_name.toLowerCase();
                const config = getModuleConfig(normalizedName);
                const s = ACCENT_STYLES[config.accent];
                const Icon = config.icon;

                return (
                  <TableRow
                    key={module.id}
                    className="hover:bg-accent/50 transition-colors border-b border-border"
                  >
                    <TableCell className="py-3 pl-4 pr-2 w-12">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}
                      >
                        <Icon className={`h-4 w-4 ${s.iconText}`} />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-2 font-semibold text-foreground min-w-[120px]">
                      {module.module_name}
                    </TableCell>
                    <TableCell className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell max-w-xs truncate">
                      {module.description ?? "—"}
                    </TableCell>
                    {showActions && (
                      <TableCell className="py-3 px-4 text-right w-24">
                        <div className="inline-flex items-center gap-1 justify-end">
                          {role === "ADMIN" && onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(module)}
                              aria-label={t("modules.editModule")}
                              className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(module)}
                              aria-label={t("modules.removeFromClinic")}
                              className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-muted transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="text-center py-10 text-muted-foreground"
                >
                  {t("modules.noData")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
