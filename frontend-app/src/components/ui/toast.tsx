import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const viewportPadding = 25

const rootStyle = {
  position: "fixed",
  zIndex: 9999,
  display: "flex",
  width: "max-content",
  padding: viewportPadding,
  pointerEvents: "none",
} as React.CSSProperties

const rootStyles = [
  {
    top: 0,
    right: 0,
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  {
    top: 0,
    left: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  {
    top: "center",
    left: 0,
    display: "grid",
    alignItems: "center",
    justifyContent: "start",
  },
  {
    bottom: 0,
    left: 0,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  {
    bottom: 0,
    right: 0,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  {
    bottom: "center",
    left: 0,
    display: "grid",
    alignItems: "end",
    justifyContent: "start",
  },
]

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full max-w-xs flex-col items-start gap-4 rounded-border bg-popover p-6 text-popover-foreground shadow-md transition-all data-[swipe:end]:animate-out data-[swipe:end]:fade-out data-[swipe:end]:pointer-events-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out fps-data-[state=open]:animate-in fps-data-[state=open]:fade-in fps-data-[state=open]:zoom-in fps-data-[state=closed]:animate-out fps-data-[state=closed]:fade-out fps-data-[state=closed]:zoom-out",
  {
    variants: {
      variant: {
        default: "border",
        destructive:
          "border-destructive/60 text-destructive bg-destructive/90",
          success: "border-success/60 text-success bg-success/90",
          warning: "border-warning/60 text-warning bg-warning/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const ToastProvider = ToastPrimitive.Provider

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: VariantProps<typeof toastVariants>["variant"]
}

const Toast = React.forwardRef<ToastProps, HTMLElement>(
  ({ className, variant, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={twMerge(
        toastVariants({ variant }),
        className,
      )}
      {...props}
    >
      {props.children}
    </ToastPrimitive.Root>
  ),
)
Toast.displayName = ToastPrimitive.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementType,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={clsx(
      "text-sm font-semibold",
      className,
    )}
    {...props}
  >
    {props.children}
  </ToastPrimitive.Title>
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementType,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={clsx(
      "text-sm [&_a]:underline [&_a]:underline-offset-4",
      className,
    )}
    {...props}
  >
    {props.children}
  </ToastPrimitive.Description>
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

const ToastAction = React.forwardRef<
  React.ElementType,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={clsx(
      "rounded-md bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground hover:bg-muted/80 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
      className,
    )}
    {...props}
  >
    {props.children}
  </ToastPrimitive.Action>
))
ToastAction.displayName = ToastPrimitive.Action.displayName

const ToastViewport = React.forwardRef<
  React.ElementType,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, position, ...props }, ref) => {
  const style = rootStyles[position ?? 0] ?? rootStyles[0]
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      style={{ ...rootStyle, ...style }}
      className={clsx(className)}
      {...props}
    />
  )
})
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

export {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastViewport,
  toastVariants,
}