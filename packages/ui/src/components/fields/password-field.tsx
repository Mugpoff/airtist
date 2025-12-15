"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"
import { PasswordInput, type PasswordInputProps } from "../ui/password-input"

export const PasswordField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label = "Password",
  description,
  ...props
}: Omit<PasswordInputProps, "name"> & {
  name: TName
  control: Control<TFieldValues>
  label?: string
  description?: string
}) => (
  <Controller
    name={name}
    control={control}
    render={({
      field: { value, ...field },
      fieldState: { invalid, isTouched, isDirty, error },
    }) => (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <PasswordInput
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
