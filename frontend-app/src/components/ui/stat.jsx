import * as React from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Stat = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex w-full flex-col items-center gap-2 text-center",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
))
Stat.displayName = "Stat"

const StatLabel = React.forwardRef(({ className, ...props }, ref) => (
  <p
    className={cn(
      "text-xs font-medium text-muted-foreground",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </p>
))
StatLabel.displayName = "StatLabel"

const StatValue = React.forwardRef(({ className, ...props }, ref) => (
  <p
    className={cn(
      "text-2xl font-bold text-foreground",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </p>
))
StatValue.displayName = "StatValue"

export { Stat, StatLabel, StatValue }