"use client"

import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { forwardRef, useState } from "react"
import { Button } from "./button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import { Tooltip, TooltipPopup, TooltipTrigger } from "./tooltip"

export interface PasswordInputProps
  extends Omit<React.ComponentProps<typeof InputGroupInput>, "type"> {
  containerClassName?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ containerClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <InputGroup className={containerClassName}>
        <InputGroupInput
          ref={ref}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  size="icon-xs"
                  variant="ghost"
                />
              }
            >
              {showPassword ? (
                <HugeiconsIcon icon={ViewOffSlashIcon} className="size-4" />
              ) : (
                <HugeiconsIcon icon={ViewIcon} className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipPopup>
              {showPassword ? "Hide password" : "Show password"}
            </TooltipPopup>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
