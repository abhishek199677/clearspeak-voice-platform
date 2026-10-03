import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const dropdownMenuContentVariants = cva(
  "min-w-[8rem] p-0 bg-popover text-popover-foreground rounded-md border shadow-lg pointer-events-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out data-[state=open]:zoom-in",
  {
    variants: {
      sideOffset: {
        top: "mt-2",
        bottom: "mt-2",
        left: "ml-2",
        right: "mr-2",
      },
    },
    defaultVariants: {
      sideOffset: "bottom",
    },
  }
)

const dropdownMenuItemVariants = cva(
  "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {},
    defaultVariants: {},
  }
)

const dropdownMenuTriggerVariants = cva(
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

// Variant prop types (TypeScript interfaces removed for JSX compatibility)
// interface DropdownMenuContentVariantProps extends VariantProps<typeof dropdownMenuContentVariants> {
//   sideOffset?: "top" | "bottom" | "left" | "right"
// }
//
// interface DropdownMenuItemVariantProps extends VariantProps<typeof dropdownMenuItemVariants> {}
//
// interface DropdownMenuTriggerVariantProps extends VariantProps<typeof dropdownMenuTriggerVariants> {}

const DropdownMenu = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Root
    ref={ref}
    className={clsx("relative z-50", className)}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Root>
))
DropdownMenu.displayName = DropdownMenuPrimitive.Root.displayName

const DropdownMenuTrigger = React.forwardRef(({ className, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={twMerge(
      dropdownMenuTriggerVariants({ variant }),
      className,
    )}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Trigger>
))
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName

const DropdownMenuContent = React.forwardRef(({ className, sideOffset, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    className={twMerge(
      dropdownMenuContentVariants({}),
      dropdownMenuContentVariants({ sideOffset }),
      className,
    )}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Content>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={twMerge(dropdownMenuItemVariants({}), className)}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={clsx(
      "flex items-center cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <DropdownMenuPrimitive.ItemIndicator />
    <span className="flex-1">{props.children}</span>
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuGroup = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={clsx("mt-1", className)}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Group>
))
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={clsx(
      "px-2 py-1.5 text-sm font-medium text-muted-foreground",
      className,
    )}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Label>
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={clsx("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Separator>
))
DropdownMenuSeparator.displayName =
  DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }) => (
  <span
    className={clsx(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className,
    )}
    {...props}
  />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

const DropdownMenuSub = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Sub
    ref={ref}
    className={clsx(
      "ml-6 block px-2 py-1.5 text-sm font-medium text-muted-foreground",
      className,
    )}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Sub>
))
DropdownMenuSub.displayName = DropdownMenuPrimitive.Sub.displayName

const DropdownMenuSubTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={clsx(
      "flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted",
      className,
    )}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={clsx(
      "ml-6 mt-1 w-full max-h-[10rem] overflow-y-auto border-l border-muted pl-2",
      className,
    )}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.SubContent>
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
  dropdownMenuTriggerVariants,
}