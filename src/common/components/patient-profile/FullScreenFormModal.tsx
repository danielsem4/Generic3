import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface IFullScreenFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  dir: "rtl" | "ltr";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  finalizeButton: React.ReactNode;
  cancelText: string;
}

export function FullScreenFormModal({
  isOpen,
  setIsOpen,
  dir,
  icon,
  title,
  children,
  finalizeButton,
  cancelText,
}: IFullScreenFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="!fixed !inset-0 !z-[100] !max-w-none !w-screen !h-screen !m-0 !p-0 !bg-background !border-none !translate-x-0 !translate-y-0 !rounded-none overflow-y-auto"
        dir={dir}
      >
        <div className="flex justify-center items-start w-full min-h-screen bg-background">
          <div className="w-full max-w-4xl py-12 px-6 flex flex-col gap-10">
            <DialogHeader className="text-center flex flex-col items-center relative">
              <div className="bg-primary/10 p-4 rounded-3xl w-fit mb-4">
                {icon}
              </div>

              <DialogTitle className="text-4xl font-extrabold tracking-tight">
                {title}
              </DialogTitle>

              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 rounded-full h-10 w-10 text-muted-foreground hover:bg-secondary"
                >
                  <X size={24} />
                </Button>
              </DialogClose>
            </DialogHeader>

            {children}

            <div className="flex justify-center gap-5 pt-8 border-t mt-4 pb-12 bg-background">
              {finalizeButton}

              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="h-16 px-10 text-xl font-semibold text-muted-foreground hover:bg-secondary rounded-2xl"
                >
                  {cancelText}
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}