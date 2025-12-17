"use client"

import { useTranslations } from "next-intl"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../base/field"
import { PasswordInput, type PasswordInputProps } from "../base/password-input"

export const PasswordField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  ...props
}: Omit<PasswordInputProps, "name"> & {
  name: TName
  control: Control<TFieldValues>
  label?: string
  description?: string
}) => {
  const t = useTranslations("global")
  const resolvedLabel = label ?? t("password")

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
          <PasswordInput
            value={value ?? ""}
            aria-invalid={invalid || undefined}
            data-touched={isTouched || undefined}
            data-dirty={isDirty || undefined}
            {...field}
            {...props}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {error && <FieldError message={error.message} />}
        </Field>
      )}
    />
  )
}
