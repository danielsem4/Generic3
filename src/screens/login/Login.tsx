import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "./use_login"
import type { LoginCredentials } from "./LoginCredentails"
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { mutateAsync, isPending} = useLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  const handleLogin = async (values: LoginCredentials) => {
    try {
      await mutateAsync(values);

      toast.success("Login successful!", {
        description: "Redirecting to home...",
        duration: 2000,
      });

      navigate("/home");
    } catch (e) {
      console.log("Login error:", e);

      toast.error("Login failed", {
        description: "Please check your credentials.",
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="ml-auto text-sm text-primary hover:text-primary/80 font-medium bg-transparent border-none p-0 cursor-pointer"
                  // onClick={() => { /* handle forgot password */ }}
                >
                  Forgot your password?
                </button>
              </div>
              <Input id="password" 
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required />
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
        {isPending ? "Logging in..." : "Login"}
       </Button>

      </CardFooter>
    </Card>
    </div>
  )
}

