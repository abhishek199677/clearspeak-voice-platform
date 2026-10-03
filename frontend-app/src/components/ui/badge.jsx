import * as React from "react"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive:
          "border-transparent bg-destructive text-destructive-foreground",
          outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <span
    className={twMerge(badgeVariants({ variant }), className)}
    ref={ref}
    {...props}
  >
    {props.children}
  </span>
))
Badge.displayName = "Badge"

export { Badge, badgeVariants }