import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
} as const;

interface UserAvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ initials, size = "md", className }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold uppercase",
        sizeMap[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
