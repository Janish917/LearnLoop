"use client";

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-[#5B4BDB] text-white hover:bg-[#6c5eec] hover:shadow-[0_0_25px_rgba(91,75,219,0.45)] border border-[#6c5eec]/20",
        secondary: "bg-[#0B1020]/80 text-white border border-white/8 hover:border-[#14B8A6]/40 hover:bg-[#0B1020] hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]",
        teal: "bg-[#14B8A6] text-[#050816] hover:bg-[#1cd2be] hover:shadow-[0_0_25px_rgba(20,184,166,0.45)] font-semibold",
        gold: "bg-[#F59E0B] text-[#050816] hover:bg-[#fbb638] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] font-semibold",
        glass: "glass-panel text-white hover:bg-white/8 hover:border-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]",
        outline: "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20",
        ghost: "text-white/80 hover:bg-white/5 hover:text-white",
        link: "text-[#5B4BDB] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-5 py-2",
        xs: "h-7 gap-1.5 rounded-md px-3 text-xs",
        sm: "h-9 gap-1.5 rounded-md px-4 text-xs",
        lg: "h-12 gap-2 rounded-lg px-7 text-sm",
        xl: "h-14 gap-2.5 rounded-xl px-9 text-base",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", glow = false, children, ...props }, ref) => {
    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, className }),
          glow && "shadow-[0_0_30px_rgba(91,75,219,0.35)]"
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </ButtonPrimitive>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
