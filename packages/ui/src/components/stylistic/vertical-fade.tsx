"use client"

import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

export const VerticalFade = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "mask-t-from-[calc(100%-min(var(--fade-size),12px))] mask-b-from-[calc(100%-min(var(--fade-size),12px))] h-full overscroll-contain [--fade-size:1.5rem]",
        className,
      )}
      data-slot="vertical-fade"
      {...props}
    />
  )
}
