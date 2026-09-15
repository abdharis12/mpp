import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_2px_6px_rgba(18,60,134,0.14),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-primary/90 active:shadow-[inset_0_2px_5px_rgba(18,60,134,0.25)]",
        destructive:
          "bg-destructive text-white shadow-[0_2px_6px_rgba(220,38,38,0.18),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)]",
        outline:
          "border border-input bg-background shadow-[0_2px_6px_rgba(18,60,134,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-accent hover:text-accent-foreground active:shadow-[inset_0_2px_5px_rgba(18,60,134,0.12)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_2px_6px_rgba(18,60,134,0.14),inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-secondary/80 active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.25)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
