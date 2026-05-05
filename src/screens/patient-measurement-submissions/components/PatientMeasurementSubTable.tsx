import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/common/utils/formatDate";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DeleteButton } from "@/common/components/DeleteButton";

interface ISubmissionItem {
  id: string;
  submissionDate: string;
  frequency: string;
  grade: string | number;
  maxScore: string | number;
}

interface Props {
  submissions: ISubmissionItem[];
  onDelete: (id: string) => void;
}

export default function PatientMeasurementSubmissionsTable({
  submissions,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("patientMeasurements.submissions.tableTitle")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("patientMeasurements.submissions.tableDescription")}
        </p>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t("patientMeasurements.submissions.columns.submissionDate")}
              </TableHead>
              <TableHead>
                {t("patientMeasurements.submissions.columns.frequency")}
              </TableHead>
              <TableHead>
                {t("patientMeasurements.submissions.columns.grade")}
              </TableHead>
              <TableHead className="text-right">
                {t("patientMeasurements.submissions.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {submissions.length ? (
              submissions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {formatDate(item.submissionDate)}
                  </TableCell>

                  <TableCell>
                    <span className="rounded-md bg-muted text-foreground px-2 py-1 text-xs font-semibold">
                      {item.frequency}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold">{item.grade}</span>
                    <span className="text-muted-foreground">
                      /{item.maxScore}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/patients/${userId}/measurement-submissions/${item.id}`
                          )
                        }
                        className="text-primary hover:opacity-80"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <DeleteButton
                        onClick={() => setDeleteId(item.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  {t("patientMeasurements.submissions.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title={t("patientMeasurements.deleteConfirm.title")}
        description={t("patientMeasurements.deleteConfirm.description")}
        confirmLabel={t("patientMeasurements.deleteConfirm.confirm")}
        cancelLabel={t("patientMeasurements.deleteConfirm.cancel")}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        variant="destructive"
      />
    </Card>
  );
}