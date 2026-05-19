import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "../utils/exportToExcel";
import { useTranslation } from "react-i18next";

interface ExportExcelButtonProps<T extends Record<string, unknown>> {
  data: T[];
  fileName: string;
  sheetName?: string;
}

export function ExportExcelButton<T extends Record<string, unknown>>({
  data,
  fileName,
  sheetName,
}: ExportExcelButtonProps<T>) {
    const { t } = useTranslation();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => exportToExcel(data, fileName, sheetName)}
      disabled={!data.length}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
       {t("analytics.export")}
    </Button>
  );
}