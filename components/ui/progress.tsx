import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    variant?: "default" | "bitcoin"
  }
>(({ className, value, max = 100, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      variant === "bitcoin" && "bitcoin-progress",
      className,
    )}
    {...props}
  >
    <div
      className={cn("h-full w-full flex-1 bg-primary transition-all", variant === "bitcoin" && "bitcoin-progress-bar")}
      style={{ width: `${((value || 0) / max) * 100}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }

