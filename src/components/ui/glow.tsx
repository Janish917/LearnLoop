import React from "react";
import { cn } from "@/lib/utils";

interface GlowProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "purple" | "teal" | "gold" | "mixed";
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

export function Glow({
  className,
  color = "purple",
  size = "md",
  animate = true,
  ...props
}: GlowProps) {
  const colorGradients = {
    purple: "from-primary-purple/40 to-transparent",
    teal: "from-secondary-teal/30 to-transparent",
    gold: "from-accent-gold/20 to-transparent",
    mixed: "from-primary-purple/30 via-secondary-teal/20 to-transparent",
  };

  const sizeClasses = {
    sm: "w-[200px] h-[200px] blur-[60px]",
    md: "w-[400px] h-[400px] blur-[100px]",
    lg: "w-[600px] h-[600px] blur-[150px]",
    xl: "w-[900px] h-[900px] blur-[200px]",
  };

  return (
    <div
      className={cn(
        "absolute rounded-full bg-radial pointer-events-none select-none mix-blend-screen opacity-50",
        colorGradients[color],
        sizeClasses[size],
        animate && "animate-pulse-slow",
        className
      )}
      {...props}
    />
  );
}
