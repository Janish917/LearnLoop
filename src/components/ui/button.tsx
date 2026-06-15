"use client";

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-lg border text-sm font-medium whitespace-nowrap transition-all duration-350 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary-purple/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 overflow-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-[#5B4BDB] text-white border-[#6c5eec]/30 hover:border-[#6c5eec]/60 hover:bg-[#6c5eec] hover:shadow-[0_0_30px_rgba(91,75,219,0.5)] hover:scale-[1.02]",
        secondary: "bg-[#0B1020]/90 text-white/90 border-white/8 hover:border-[#14B8A6]/40 hover:text-white hover:bg-[#0B1020] hover:shadow-[0_0_25px_rgba(20,184,166,0.25)] hover:scale-[1.02]",
        teal: "bg-[#14B8A6] text-[#050816] border-[#14B8A6]/20 hover:bg-[#1cd2be] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:scale-[1.02] font-semibold",
        gold: "bg-[#F59E0B] text-[#050816] border-[#F59E0B]/20 hover:bg-[#fbb638] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] font-semibold",
        glass: "bg-white/4 backdrop-blur-md text-white border-white/10 hover:bg-white/8 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:scale-[1.02]",
        outline: "border-white/10 bg-transparent text-white/90 hover:bg-white/5 hover:border-white/20 hover:text-white",
        ghost: "border-transparent text-white/80 hover:bg-white/5 hover:text-white",
        link: "border-transparent text-[#5B4BDB] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-6 py-2.5 rounded-lg",
        xs: "h-7 gap-1.5 rounded-md px-3 text-xs",
        sm: "h-9 gap-1.5 rounded-md px-4 text-xs",
        lg: "h-12 gap-2 rounded-lg px-8 text-sm",
        xl: "h-14 gap-2.5 rounded-xl px-10 text-base",
        icon: "size-11 rounded-lg",
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
          glow && "shadow-[0_0_30px_rgba(91,75,219,0.4)]"
        )}
        {...props}
      >
        {/* Subtle sliding reflection gloss light effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/button:animate-[shine_1.5s_ease-in-out_infinite]" />
        
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </ButtonPrimitive>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
