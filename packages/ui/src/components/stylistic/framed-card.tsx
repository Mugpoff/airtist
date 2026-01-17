import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

export const FramedCard = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "after:-inset-[5px] after:-z-1 relative ml-0 flex min-w-0 flex-1 flex-col rounded-2xl border bg-muted/50 bg-clip-padding shadow-black/5 shadow-sm after:pointer-events-none after:absolute after:rounded-[calc(var(--radius-2xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72",
      className,
    )}
    {...props}
  />
)

export const FramedCardContent = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn(
      "group -m-px relative flex overflow-hidden rounded-t-2xl border bg-background p-8 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] max-lg:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
      className,
    )}
    {...props}
  />
)
