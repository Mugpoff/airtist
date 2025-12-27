"use client"

import type { SelectRootProps } from "@base-ui/react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../base/field"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "../base/select"

export type SelectOption = {
  label: string
  value: string | number | null
}

export const SelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string = string,
  TMultiple extends boolean = false,
>({
  name,
  control,
  label,
  description,
  items,
  ...props
}: Omit<SelectRootProps<TValue, TMultiple>, "name"> & {
  name: TName
  control: Control<TFieldValues>
  label: string
  description?: string
  items: SelectOption[]
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
          <FieldLabel>{label}</FieldLabel>
          <Select
            value={value ?? null}
            onValueChange={onChange}
            items={items}
            {...field}
            {...props}
          >
            <SelectTrigger
              aria-invalid={invalid || undefined}
              data-touched={isTouched || undefined}
              data-dirty={isDirty || undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {error && <FieldError message={error.message} />}
        </Field>
      )}
    />
  )
}
