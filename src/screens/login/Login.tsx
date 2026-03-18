import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff } from "lucide-react";
import { useLoginLogic } from "./hooks/useLoginLogic";
import logo from "@/assets/app_logo.png";

export default function Login() {
  const {
    step,
    email,
    password,
    showPassword,
    formError,
    isPending,
    isAlreadyLoggedIn,
    rememberMe,
    twoFaCode,
    setTwoFaCode,
    isTwoFaPending,
    pendingClinics,
    isClinicPending,
    t,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleRememberMeChange,
    handleSubmit,
    handleTwoFaSubmit,
    handleClinicSelect,
  } = useLoginLogic();

  if (isAlreadyLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {step === "clinic_selection" ? (
        <Card className="w-full max-w-md rounded-2xl shadow-md py-0">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center mb-8 gap-2">
              <img src={logo} alt="Logo" className="w-[120px]" />
              <p className="text-lg font-semibold text-foreground">Select a Clinic</p>
              <p className="text-sm text-muted-foreground">
                Choose the clinic you want to manage in this session.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {pendingClinics.map((clinic) => (
                <Button
                  key={clinic.id}
                  variant="outline"
                  disabled={isClinicPending}
                  onClick={() => handleClinicSelect(clinic.id)}
                  className="flex items-center gap-3 h-14 px-4 justify-start rounded-full"
                >
                  {clinic.clinic_image_url ? (
                    <img
                      src={clinic.clinic_image_url}
                      alt={clinic.clinic_name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-medium">
                      {clinic.clinic_name.charAt(0)}
                    </div>
                  )}
                  <span className="truncate">{clinic.clinic_name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md rounded-2xl shadow-md py-0">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center mb-8 gap-2">
              <img src={logo} alt="Logo" className="w-[120px]" />
              <p className="text-lg font-semibold text-foreground">{t("login.welcomeBack")}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isPending}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("login.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("login.placeholder")}
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className="rounded-full px-4"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">{t("login.password")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className="rounded-full px-4 pe-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleTogglePassword}
                        className="absolute top-1/2 end-2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {formError && (
                      <p className="text-sm text-destructive">{formError}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        className="rounded"
                      />
                      {t("login.rememberMe")}
                    </label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 font-medium bg-transparent border-none p-0 cursor-pointer"
                    >
                      {t("login.forgotPassword")}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || !email || !password}
                    className="w-full rounded-full font-bold"
                  >
                    {isPending ? t("login.submitting") : t("login.submit")}
                  </Button>
                </div>
              </fieldset>
            </form>
          </CardContent>
        </Card>
      )}

      <Dialog open={step === "two_fa"}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-2">
            <InputOTP maxLength={6} value={twoFaCode} onChange={setTwoFaCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              className="w-full rounded-full font-bold"
              disabled={twoFaCode.length !== 6 || isTwoFaPending}
              onClick={handleTwoFaSubmit}
            >
              {isTwoFaPending ? "Verifying..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}