import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useForgotPasswordLogic } from "./hooks/useForgotPasswordLogic";
import { EmailStep } from "./components/EmailStep";
import { NewPasswordStep } from "./components/NewPasswordStep";
import { TwoFADialog } from "@/screens/login/components/TwoFADialog";
import logo from "@/assets/app_logo.png";

export default function ForgotPassword() {
  const {
    step,
    email,
    code,
    setCode,
    showPassword,
    formError,
    isAlreadyLoggedIn,
    isEmailPending,
    isCodePending,
    isResetPending,
    passwordForm,
    t,
    handleEmailChange,
    handleTogglePassword,
    handleBackToLogin,
    handleEmailSubmit,
    handleCodeSubmit,
    handleCodeCancel,
    handlePasswordSubmit,
  } = useForgotPasswordLogic();

  if (isAlreadyLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const isNewPassword = step === "new_password";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md rounded-2xl shadow-md py-0">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="flex flex-col items-center mb-8 gap-2">
            <img src={logo} alt="Logo" className="w-[120px]" />
            <p className="text-lg font-semibold text-foreground">
              {isNewPassword
                ? t("forgotPassword.newPasswordTitle")
                : t("forgotPassword.title")}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              {isNewPassword
                ? t("forgotPassword.newPasswordDesc")
                : t("forgotPassword.description")}
            </p>
          </div>

          {step === "email" && (
            <EmailStep
              email={email}
              formError={formError}
              isPending={isEmailPending}
              onEmailChange={handleEmailChange}
              onSubmit={handleEmailSubmit}
            />
          )}

          {isNewPassword && (
            <NewPasswordStep
              form={passwordForm}
              showPassword={showPassword}
              isPending={isResetPending}
              onTogglePassword={handleTogglePassword}
              onSubmit={handlePasswordSubmit}
            />
          )}

          {!isNewPassword && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-primary hover:text-primary/80 font-medium bg-transparent border-none p-0 cursor-pointer"
              >
                {t("forgotPassword.backToLogin")}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <TwoFADialog
        open={step === "two_fa"}
        code={code}
        isPending={isCodePending}
        onChange={setCode}
        onSubmit={handleCodeSubmit}
        onCancel={handleCodeCancel}
      />
    </div>
  );
}
