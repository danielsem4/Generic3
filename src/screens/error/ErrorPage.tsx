import { useRouteError, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-4xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="text-lg text-muted-foreground">{message}</p>
      <Button onClick={() => navigate("/home")} variant="outline">
        Go to Dashboard
      </Button>
    </div>
  );
}
