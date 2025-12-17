"use client"

import { Field as FieldPrimitive } from "@base-ui/react/field"
import { type AppConfig, type MessageKeys, useTranslations } from "next-intl"
import { cn } from "../../lib/utils"

function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      className={cn("flex flex-col items-start gap-2", className)}
      data-slot="field"
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      className={cn("inline-flex items-center gap-2 text-sm/4", className)}
      data-slot="field-label"
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      className={cn("text-muted-foreground text-xs", className)}
      data-slot="field-description"
      {...props}
    />
  )
}

function FieldError({
  className,
  message,
  ...props
}: Omit<FieldPrimitive.Error.Props, "children"> & { message?: string }) {
  const t = useTranslations()
  const messageKey = message as MessageKeys<AppConfig["Messages"], "validation">

  if (!t.has(messageKey)) {
    return null
  }

  return (
    <FieldPrimitive.Error
      className={cn("text-destructive-foreground text-xs", className)}
      data-slot="field-error"
      match={!!message}
      {...props}
    >
      {t(messageKey)}
    </FieldPrimitive.Error>
  )
}

const FieldControl = FieldPrimitive.Control
const FieldValidity = FieldPrimitive.Validity

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldValidity,
}
