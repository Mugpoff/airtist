"use client"

import type { NumberFieldRootProps } from "@base-ui/react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Field, FieldDescription, FieldError } from "../base/field"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "../base/number-field"

export const NumberInputField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  ...props
}: Omit<NumberFieldRootProps, "name"> & {
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
        field: { value, onChange, ...field },
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <Field>
          <NumberField
            value={value}
            onValueChange={onChange}
            {...field}
            {...props}
          >
            <NumberFieldScrubArea
              label={label}
              aria-required={props.required}
            />
            <NumberFieldGroup
              aria-invalid={invalid || undefined}
              data-touched={isTouched || undefined}
              data-dirty={isDirty || undefined}
            >
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
          {description && <FieldDescription>{description}</FieldDescription>}
          {error && <FieldError message={error.message} />}
        </Field>
      )}
    />
  )
}
