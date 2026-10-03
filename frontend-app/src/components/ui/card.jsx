import * as React from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </h2>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    className={cn(
      "text-sm text-muted-foreground",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </p>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={cn("p-6 pt-0", className)}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex items-center p-6 pt-0",
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}