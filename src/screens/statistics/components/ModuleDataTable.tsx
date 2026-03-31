import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IStatisticsDataPoint } from "@/common/types/statistics";

interface IModuleDataTableProps {
  dataPoints: IStatisticsDataPoint[];
}

export function ModuleDataTable({ dataPoints }: IModuleDataTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("statistics.label")}</TableHead>
            <TableHead className="text-right">{t("statistics.value")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPoints.map((point) => (
            <TableRow key={point.label}>
              <TableCell>{point.label}</TableCell>
              <TableCell className="text-right font-medium">
                {point.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
