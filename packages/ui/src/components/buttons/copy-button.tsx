import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button, type ButtonProps } from "../base/button"

type Props = ButtonProps & {
  text: string
}

export const CopyButton = ({ className, text, ...props }: Props) => {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(text)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      className={className}
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      {...props}
    >
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      <HugeiconsIcon
        icon={Copy01Icon}
        className="size-4 scale-100 transition-all duration-300 data-copied:scale-0"
        data-copied={copied || undefined}
      />
      <HugeiconsIcon
        icon={Tick02Icon}
        className="absolute inset-0 m-auto size-4 scale-0 transition-all duration-300 data-copied:scale-100"
        data-copied={copied || undefined}
      />
    </Button>
  )
}
