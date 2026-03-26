import { useTranslation } from "react-i18next";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IUser } from "@/common/Users";

interface Props {
  managers: IUser[];
  onView: (manager: IUser) => void;
  onEdit: (manager: IUser) => void;
  onDelete: (manager: IUser) => void;
}

export function ClinicManagersTable({ managers, onView, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
          <TableHead className="font-bold text-foreground text-center">{t("home.firstName")}</TableHead>
          <TableHead className="font-bold text-foreground text-center">{t("home.lastName")}</TableHead>
          <TableHead className="font-bold text-foreground text-center">{t("home.email")}</TableHead>
          <TableHead className="font-bold text-foreground text-center">{t("home.phone")}</TableHead>
          <TableHead className="font-bold text-foreground text-center">{t("home.role")}</TableHead>
          <TableHead className="font-bold text-center">{t("clinicManagers.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {managers.length > 0 ? (
          managers.map((manager) => (
            <TableRow key={manager.id ?? manager.email} className="hover:bg-accent/50 transition-colors border-b border-border">
              <TableCell className="font-medium text-foreground text-center">{manager.first_name}</TableCell>
              <TableCell className="font-medium text-foreground text-center">{manager.last_name}</TableCell>
              <TableCell className="text-muted-foreground text-center">{manager.email}</TableCell>
              <TableCell className="text-muted-foreground text-center">{manager.phone_number ?? "—"}</TableCell>
              <TableCell className="py-4 text-center">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                  {manager.role}
                </span>
              </TableCell>
              <TableCell className="py-4 text-center">
                <div className="inline-flex items-center gap-1 justify-center">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                    aria-label={t("home.view")}
                    onClick={() => onView(manager)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                    aria-label={t("clinicManagers.editTitle")}
                    onClick={() => onEdit(manager)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-muted transition"
                    aria-label={t("clinicManagers.deleteTitle")}
                    onClick={() => onDelete(manager)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
              {t("home.noData")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
