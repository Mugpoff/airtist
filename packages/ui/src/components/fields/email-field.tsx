"use client"

import { useTranslations } from "next-intl"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../base/field"
import { Input, type InputProps } from "../base/input"

export const EmailField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  ...props
}: Omit<InputProps, "name" | "type"> & {
  name: TName
  control: Control<TFieldValues>
  label?: string
  description?: string
}) => {
  const t = useTranslations("global")
  const resolvedLabel = label ?? t("email")

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, ...field },
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <Field>
          <FieldLabel>{resolvedLabel}</FieldLabel>
          <Input
            type="email"
            value={value ?? ""}
            aria-invalid={invalid || undefined}
            data-touched={isTouched || undefined}
            data-dirty={isDirty || undefined}
            {...field}
            {...props}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError match={!!error}>{error?.message}</FieldError>
        </Field>
      )}
    />
  )
}
