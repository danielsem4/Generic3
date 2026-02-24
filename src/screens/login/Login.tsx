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
import { useLogin } from "./useLogin";
import type { LoginCredentials } from "./LoginCredentails";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { ISafeUser } from "@/common/types/User";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { setAuthUser, clinicId, userId } = useAuthStore();
  const { mutateAsync, isPending } = useLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { t } = useTranslation();

  if (clinicId && userId) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (values: LoginCredentials) => {
    setFormError(null);
    try {
      const user: ISafeUser = await mutateAsync(values);
      if (user && user.clinicId && user.id) {
        setAuthUser(user);
      } else {
        console.error("User data missing in response");
      }

      toast.success(t("login.successTitle"), {
        description: t("login.successDesc"),
        duration: 2000,
      });

      navigate("/home");
    } catch {
      setFormError(t("login.errorFailed"));

      toast.error(t("login.failedTitle"), {
        description: t("login.failedDesc"),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin({ email, password });
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.placeholder")}
                  onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pe-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((prev) => !prev)}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
