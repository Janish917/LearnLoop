import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  variant?: "background" | "secondary-bg" | "transparent";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  hasBorderBottom?: boolean;
  hasBorderTop?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      className,
      variant = "background",
      spacing = "lg",
      hasBorderBottom = false,
      hasBorderTop = false,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      background: "bg-[#050816] text-[#F8FAFC]",
      "secondary-bg": "bg-[#0B1020] text-[#F8FAFC]",
      transparent: "bg-transparent text-[#F8FAFC]",
    };

    const spacingClasses = {
      none: "py-0",
      sm: "py-10 md:py-16",
      md: "py-16 md:py-24",
      lg: "py-24 md:py-32",
      xl: "py-32 md:py-48",
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden",
          variantClasses[variant],
          spacingClasses[spacing],
          hasBorderTop && "border-t border-white/5",
          hasBorderBottom && "border-b border-white/5",
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section };
