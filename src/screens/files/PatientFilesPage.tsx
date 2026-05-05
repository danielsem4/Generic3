import { useTranslation } from "react-i18next";
import { usePatientFiles } from "./hooks/usePatientFiles";
import { UploadFileDialog } from "./components/UploadFileDialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Download, FileText, Search, Loader2, AlertCircle } from "lucide-react";

export const PatientFilesPage = () => {
  const { t } = useTranslation();

  const {
    userId,
    files,
    searchQuery,
    handleSearchChange,
    handleViewFile,
    handleDownloadFile,
    isLoading,
  } = usePatientFiles();

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="text-left">
          <h1 className="text-2xl font-black text-foreground">
            {t("files.title")}
          </h1>
          <p className="text-muted-foreground text-xs font-medium mt-1">
            {t("files.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("files.search_placeholder")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 rounded-xl border-border focus:ring-ring"
            />
          </div>
          <UploadFileDialog />
        </div>
      </div>

      <main className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {!userId ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-warning" />
            <p className="font-bold text-muted-foreground text-lg">
              {t("files.missing_patient_context")}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("files.select_patient_hint")}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6 py-4 text-left">
                  {t("files.table.name")}
                </TableHead>
                <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6 text-left">
                  {t("files.table.date")}
                </TableHead>
                <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6 text-left">
                  {t("files.table.owner")}
                </TableHead>
                <TableHead className="text-right font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6">
                  {t("files.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2 opacity-50" />
                    <span className="font-bold text-muted-foreground tracking-tight">
                      {t("common.loading")}
                    </span>
                  </TableCell>
                </TableRow>
              ) : files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-20" />
                    <p className="font-bold text-muted-foreground">
                      {t("files.empty.title")}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file) => (
                  <TableRow key={file.id} className="hover:bg-muted/50 transition-colors border-b last:border-0">
                    <TableCell className="px-6 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-bold text-foreground">{file.file_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground text-sm font-medium text-left">
                      {new Date(file.uploaded_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 text-left">
                      <span className="text-muted-foreground text-sm font-semibold italic">
                        {file.uploaded_by?.full_name || t("common.system")}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFile(file.id, file.file_name)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadFile(file.id, file.file_name)}
                          className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  );
};

export default PatientFilesPage;
