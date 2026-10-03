import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const tabsListVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center rounded-sm px-3 h-10 text-sm font-medium gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-none",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground",
        destructive:
          "text-destructive/[&:not([data-state=active])]:hover:bg-destructive/20 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
          outline:
          "border-background hover:bg-muted data-[state=active]:bg-popover data-[state=active]:text-popover-foreground",
          ghost: "hover:bg-muted",
          underline:
          "border-b-0 hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={clsx("w-full", className)}
    {...props}
  >
    {props.children}
  </TabsPrimitive.Root>
))
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={twMerge(tabsListVariants({ className }), className)}
    {...props}
  >
    {props.children}
  </TabsPrimitive.List>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={twMerge(
      tabsTriggerVariants({ variant, className }),
      className,
    )}
    {...props}
  >
    {props.children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={clsx(
      "mt-2 ring-offset-bg background/10 text-popover-foreground",
      className,
    )}
    {...props}
  >
    {props.children}
  </TabsPrimitive.Content>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }