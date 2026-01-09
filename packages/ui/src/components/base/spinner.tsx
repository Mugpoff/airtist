import { cn } from "../../lib/utils"
import { LoaderCircleIcon } from "../icons/loader-circle"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderCircleIcon
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      role="status"
      {...props}
    />
  )
}

export { Spinner }
