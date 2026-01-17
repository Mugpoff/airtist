import type * as React from "react"
import { cn } from "../../lib/utils"

function Label({
  className,
  "aria-required": required,
  children,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("inline-flex items-center gap-2 text-sm/4", className)}
      data-slot="label"
      {...props}
    >
      {children}
      {required && (
        <span className="-ml-1 text-destructive-foreground text-xs">*</span>
      )}
    </label>
  )
}

export { Label }
