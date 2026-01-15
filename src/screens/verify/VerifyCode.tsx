import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function VerifyCode() {
  const navigate = useNavigate()
  const [value, setValue] = React.useState("")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Verify Your Account</CardTitle>
            <CardDescription>
                Enter the one-time password sent to your email.
            </CardDescription>
        </CardHeader>

       <CardContent className="space-y-6">
        <div className="flex justify-center">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
    {/* 1) Confirm */}
<Button
  className="w-full"
  disabled={value.length !== 6}
  onClick={() => navigate("/next")}
>
  Confirm
</Button>

{/* 2) Resend code */}
<div className="text-center">
  <button
    type="button"
    className="text-sm text-primary hover:text-primary/80 font-medium"
    onClick={() => console.log("resend code")}
  >
    Resend code
  </button>
</div>
    </CardContent>
      </Card>
    </div>
 )
}
