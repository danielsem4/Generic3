import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useLoginLogic } from "./hooks/useLoginLogic";

export default function Login() {
  const {
    email,
    password,
    showPassword,
    formError,
    isPending,
    isAlreadyLoggedIn,
    t,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleSubmit,
  } = useLoginLogic();

  if (isAlreadyLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isPending}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.placeholder")}
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <button
                    type="button"
                    className="ms-auto text-sm text-primary hover:text-primary/80 font-medium bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="pe-10"
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
            </div>

            <CardFooter className="flex-col gap-2 px-0 pt-6">
              <Button
                type="submit"
                disabled={isPending || !email || !password}
                className="w-full"
              >
                {isPending ? t("login.submitting") : t("login.submit")}
              </Button>
            </CardFooter>
          </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
