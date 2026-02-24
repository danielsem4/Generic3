import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-lg text-muted-foreground">Page not found</p>
      <Button onClick={() => navigate("/home")} variant="outline">
        Go to Dashboard
      </Button>
    </div>
  );
}
