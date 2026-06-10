import { Sofa } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { container: "h-8 w-8", icon: "h-4 w-4" },
  md: { container: "h-10 w-10", icon: "h-5 w-5" },
  lg: { container: "h-12 w-12", icon: "h-6 w-6" },
} as const;

interface LogoMarkProps {
  size?: keyof typeof sizes;
  shape?: "circle" | "rounded";
  className?: string;
}

export function LogoMark({ size = "sm", shape = "circle", className }: LogoMarkProps) {
  const { container, icon } = sizes[size];

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-accent text-white shadow-sm",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        container,
        className,
      )}
    >
      <Sofa className={icon} strokeWidth={2.25} aria-hidden="true" />
    </span>
  );
}
