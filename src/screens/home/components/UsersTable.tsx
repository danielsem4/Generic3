import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IUser } from "@/common/Users";

const MAX_ROWS = 10;

interface IUsersTableProps {
  users: IUser[];
  title?: string;
}

export function UsersTable({ users, title }: IUsersTableProps) {
  const { t } = useTranslation();

  const displayedUsers = users.slice(0, MAX_ROWS) || [];

  return (
    <Card className="w-full shadow-lg border-none overflow-hidden bg-card text-card-foreground">
      <CardHeader className="pb-4 border-b border-border">
        <CardDescription className="text-2xl font-bold text-foreground">
          {title ?? t("home.latestUsers")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableCaption>{t("home.updatedNow")}</TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">{t("home.firstName")}</TableHead>
              <TableHead className="font-bold">{t("home.lastName")}</TableHead>
              <TableHead className="font-bold">{t("home.email")}</TableHead>
              <TableHead className="font-bold">{t("home.phone")}</TableHead>
              <TableHead className="font-bold">{t("home.role")}</TableHead>
              <TableHead className="font-bold text-center">
                {t("home.view")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user, index) => (
                <TableRow key={user.id || index}>
                  <TableCell className="font-medium">
                    {user.first_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number ?? "—"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-center">
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
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  {t("home.noData")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t border-border bg-muted/20 pt-4">
        <p className="text-xs text-muted-foreground">
          {t("home.showing", {
            count: Math.min(users.length, MAX_ROWS),
            total: users.length,
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
