"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../base/field"
import { Textarea, type TextareaProps } from "../base/textarea"

export const TextareaField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  ...props
}: Omit<TextareaProps, "name"> & {
  name: TName
  control: Control<TFieldValues>
  label: string
  description?: string
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, ...field },
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>
          <Textarea
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
