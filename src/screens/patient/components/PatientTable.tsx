import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IUser } from "@/common/Users";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

interface PatientsTableProps {
  patients: IUser[];
}

export const PatientsTable = ({ patients }: PatientsTableProps) => {
    const { t } = useTranslation();
  return (
    <Table>
      <TableHeader> 
        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
        <TableHead className="font-bold text-foreground">{t("home.firstName")}</TableHead>
        <TableHead className="font-bold text-foreground">{t("home.lastName")}</TableHead>
          <TableHead className="font-bold text-foreground">{t("home.email")}</TableHead>
          <TableHead className="font-bold text-foreground">{t("home.phone")}</TableHead>
          <TableHead className="font-bold text-foreground">{t("home.role")}</TableHead>
          <TableHead className="font-bold text-end">{t("home.view")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.length > 0 ? (
          patients.map((user) => (
            <TableRow key={user.id ?? user.email} className="hover:bg-accent/50 transition-colors border-b border-border">
              <TableCell className="font-medium text-foreground">{user.first_name} </TableCell>
                <TableCell className="font-medium text-foreground">{user.last_name}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell className="text-muted-foreground">{user.phone_number ?? "—"}</TableCell>
              <TableCell className="py-4">
               <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold uppercase">                 
                {user.role}
                </span>
              </TableCell>
              <TableCell className="py-4 text-end">
                <button
                  className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t("home.viewPatient")}
                >
                  <Eye size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">{t("home.noData")}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};    