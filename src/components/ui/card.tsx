"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "purple" | "teal" | "gold" | "none";
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glowColor = "none", interactive = true, children, ...props }, ref) => {
    const glowClasses = {
      purple: "hover:shadow-[0_0_30px_rgba(91,75,219,0.15)] hover:border-primary-purple/30",
      teal: "hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-secondary-teal/30",
      gold: "hover:shadow-[0_0_30px_rgba(245,158,11,0.12)] hover:border-accent-gold/20",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass-card rounded-xl p-6 relative overflow-hidden transition-all duration-400",
          interactive && "hover:-translate-y-1",
          glowColor !== "none" && glowClasses[glowColor],
          className
        )}
        {...props}
      >
        {/* Subtle premium gradient reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full">{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardHeader = ({ className, ...props }: CardHeaderProps) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
const CardTitle = ({ className, ...props }: CardTitleProps) => (
  <h3 className={cn("text-xl font-bold tracking-tight text-white", className)} {...props} />
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
const CardDescription = ({ className, ...props }: CardDescriptionProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardContent = ({ className, ...props }: CardContentProps) => (
  <div className={cn("flex-grow pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardFooter = ({ className, ...props }: CardFooterProps) => (
  <div className={cn("flex items-center pt-4 border-t border-white/5 mt-auto", className)} {...props} />
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
