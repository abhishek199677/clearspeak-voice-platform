import * as React from "react"
import { cn } from "@/lib/utils"

const LiquidButton = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "liquid-btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium",
      "transition-[transform,box-shadow] duration-300",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
LiquidButton.displayName = "LiquidButton"

export { LiquidButton }
export default LiquidButton
