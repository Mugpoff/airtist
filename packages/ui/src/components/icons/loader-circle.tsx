import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

export const LoaderCircleIcon = ({
  className,
  ...props
}: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "lucide lucide-loader-circle-icon lucide-loader-circle",
        className,
      )}
      {...props}
    >
      <title>Loader Circle</title>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
