import * as React from "react"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const separatorVariants = cva(
  "flex h-0.5 flex-1 items-center justify-between",
  {
    variants: {
      orientation: {
        horizontal: "h-0.5 w-full",
        vertical: "w-0.5 h-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

const Separator = React.forwardRef(({ className, orientation, ...props }, ref) => (
  <div
    className={twMerge(
      separatorVariants({ orientation }),
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
))
Separator.displayName = "Separator"

export { Separator, separatorVariants }