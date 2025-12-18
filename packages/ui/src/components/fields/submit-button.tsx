"use client"

import type { ComponentProps } from "react"
import { useFormState } from "react-hook-form"
import { Button } from "../base/button"

export const SubmitButton = ({
  disabled,
  submittingText,
  ...props
}: Omit<ComponentProps<typeof Button>, "type"> & {
  submittingText?: string
}) => {
  const { isSubmitting, isValid } = useFormState()

  return (
    <Button
      type="submit"
      disabled={disabled || isSubmitting || !isValid}
      {...props}
    >
      {isSubmitting && submittingText ? submittingText : props.children}
    </Button>
  )
}
