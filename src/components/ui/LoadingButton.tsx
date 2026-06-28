import { type ReactNode, type ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

interface LoadingButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: Readonly<LoadingButtonProps>) {
  const { t } = useTranslation();

  return (
    <Button 
      disabled={disabled || loading} 
      {...props}
    >
      {loading ? (
        <>
          <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />
          <span>{loadingText ?? t("common.loading.buttonText", "Please wait")}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}