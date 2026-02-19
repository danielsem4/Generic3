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
import { useLogin } from "../hooks/useLogin";
import type { LoginCredentials } from "../types/auth.types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import dmtIcon from "@/assets/DMT_icon.png";

export const LoginPage = () => {
  const { mutateAsync, isPending } = useLogin();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (values: LoginCredentials) => {
    setFormError(null);
    try {
      const result = await mutateAsync(values);
      console.log("LOGIN RESPONSE:", result);
      localStorage.setItem("isAuthenticated", "true");
      toast.success(t("login.success"), {
        description: t("login.successDescription"),
        duration: 2000,
      });
      navigate("/home");
    } catch (e) {
      setFormError(t("login.formError"));
      console.log("Login error:", e);
      toast.error(t("login.error"), {
        description: t("login.errorDescription"),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 bg-background">
      <img
        src={dmtIcon}
        alt="DMT Logo"
        className="w-24 h-24 object-contain"
      />

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription>
            {t("login.description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <button
                    type="button"
                    className="ml-auto text-sm text-primary hover:text-primary/80 font-medium bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {formError && (
                  <p className="text-sm text-destructive">
                    {formError}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={() => handleLogin({ email, password })}
            disabled={isPending || !email || !password}
            className="w-full"
          >
            {isPending ? t("login.submitting") : t("login.submit")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
