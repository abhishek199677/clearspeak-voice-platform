import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const dialogTriggerVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline: "border border-input hover:bg-accent hover:text-accent-foreground",
          secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "underline-offset-4 hover:underline text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Dialog = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Root
    ref={ref}
    className={clsx("w-full", className)}
    {...props}
  >
    {props.children}
  </DialogPrimitive.Root>
))
Dialog.displayName = DialogPrimitive.Root.displayName

const DialogTrigger = React.forwardRef(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={twMerge(
      dialogTriggerVariants({ variant }),
      className,
    )}
    {...props}
  >
    {props.children}
  </DialogPrimitive.Trigger>
))
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={clsx(
      "fixed left-[50%] top-[50%] grid w-full max-w-lg max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border border-background bg-popover p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in",
      className,
    )}
    {...props}
  >
    {DialogPrimitive.Title && (
      <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
        Dialog Title
      </DialogPrimitive.Title>
    )}
    {DialogPrimitive.Description && (
      <DialogPrimitive.Description className="text-sm text-muted-foreground">
        Dialog Description
      </DialogPrimitive.Description>
    )}
    {children}
  </DialogPrimitive.Content>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogDescription = DialogPrimitive.Description
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogTitle = DialogPrimitive.Title
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogFooter = ({ className, ...props }) => (
  <div className={clsx("flex justify-end pt-4 space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogHeader = ({ className, ...props }) => (
  <div className={clsx("flex space-x-2", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogTriggerVariants,
}