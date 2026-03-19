import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Dialog,DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogFooter,DialogClose,} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import type { IPatientDetails } from "@/common/types/patientDetails";
import { usePatientEditDialog } from "../hooks/usePatientEditDialog";

interface Props {
  readonly patient: IPatientDetails;
}

export default function PatientEditDialog({ patient }: Props) {
  const { t } = useTranslation();
  const dialog = usePatientEditDialog(patient);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2 rounded-lg border border-primary/10 bg-primary/10 text-primary shadow-none hover:bg-primary/20"
        >
          <Pencil className="h-4 w-4" />
          {t("patient.editDetails")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>{t("patient.editDialogTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label htmlFor="firstName" className="text-sm font-medium">
              {t("patient.firstName")}
            </label>
            <Input
              id="firstName"
              value={dialog.firstName}
              onChange={dialog.handleFirstNameChange}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium">
              {t("patient.lastName")}
            </label>
            <Input
              id="lastName"
              value={dialog.lastName}
              onChange={dialog.handleLastNameChange}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium">
              {t("patient.phone")}
            </label>
            <Input
              id="phone"
              value={dialog.phone}
              onChange={dialog.handlePhoneChange}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              {t("patient.email")}
            </label>
            <Input
              id="email"
              value={dialog.email}
              onChange={dialog.handleEmailChange}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">{t("patient.cancel")}</Button>
          </DialogClose>

          <Button onClick={dialog.handleSave}>{t("patient.saveChanges")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}