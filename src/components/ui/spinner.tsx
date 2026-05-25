import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<SVGElement> {
  "data-icon"?: string;
}

export function Spinner({ className, ...props }: Readonly<SpinnerProps>) {
  return (
    <Loader2
      className={cn("h-4 w-4 animate-spin text-current", className)}
      {...props}
    />
  );
}