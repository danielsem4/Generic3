import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAuthStore } from '@/store/useAuthStore';
import { usePatientFiles } from "./hooks/usePatientFiles";
import { UploadFileDialog } from "./components/UploadFileDialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Download, FileText, Search, Loader2, AlertCircle } from "lucide-react";
import { viewFile, downloadFile } from "./utils/fileHandlers";

export const PatientFilesPage = () => {
  const { t } = useTranslation();
  const { clinicId } = useAuthStore();

  const { userId } = useParams(); 
  const [searchQuery, setSearchQuery] = useState("");

  const { files, isLoading } = usePatientFiles();

  useEffect(() => {
    console.log("🚀 PatientFilesPage simple load for User:", userId);
  }, [userId]);

  const filteredFiles = (files || []).filter(file => 
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-transparent" dir="ltr">
      {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">        <div className="text-left">
          <h1 className="text-2xl font-black text-foreground">
                {t("files.title", "Patient Documents")}
          </h1>
             <p className="text-muted-foreground text-xs font-medium mt-1">
                {t("files.subtitle", "Manage and view shared medical files")}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder={t("files.search_placeholder", "Search files...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-border focus:ring-ring"
            />
          </div>
          <UploadFileDialog />
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {!userId ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-warning" />
            <p className="font-bold text-muted-foreground text-lg">
               {t("files.missing_patient_context", "Missing Patient Context")}
                </p>
                <p className="text-muted-foreground text-sm">
                 {t(  "files.select_patient_hint","Please select a patient to view their documents.")}
               </p>          
               </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6 py-4 text-left">
                           {t("files.table.name", "Name")}
                          </TableHead>
                <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6 text-left">
                           {t("files.table.date", "Date")}
                          </TableHead>
                <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6 text-left">
                           {t("files.table.owner", "Owner")}
                          </TableHead>
                <TableHead className="text-right font-bold text-muted-foreground uppercase text-[10px] tracking-wider px-6">
                           {t("files.table.actions", "Actions")}
                          </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2 opacity-50" />
                    <span className="font-bold text-muted-foreground tracking-tight">
                    {t("common.loading", "Loading...")}
                   </span>
                  </TableCell>
                </TableRow>
              ) : filteredFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-20" />
                    <p className="font-bold text-muted-foreground">
                     {t("files.empty.title", "No documents available")}
                     </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFiles.map((file) => (
                  <TableRow key={file.id} className="hover:bg-muted/50 transition-colors border-b last:border-0">
                    <TableCell className="px-6 py-4 text-left">
                      <div className="flex items-center gap-3 italic">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-bold text-foreground not-italic">{file.file_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground text-sm font-medium text-left">
                      {new Date(file.uploaded_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 text-left">
                      <span className="text-muted-foreground text-sm font-semibold italic">{file.uploaded_by?.full_name || "System"}</span>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => viewFile(clinicId!, userId!, file.id, file.file_name)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => downloadFile(clinicId!, userId!, file.id, file.file_name)}
                          className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
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