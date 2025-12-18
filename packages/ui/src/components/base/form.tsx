"use client"

import { Form as FormPrimitive } from "@base-ui/react/form"
import {
  type FieldValues,
  FormProvider,
  type UseFormReturn,
} from "react-hook-form"
import { cn } from "../../lib/utils"

function Form<TFieldValues extends FieldValues = FieldValues>({
  className,
  form,
  ...props
}: FormPrimitive.Props & { form: UseFormReturn<TFieldValues> }) {
  return (
    <FormProvider {...form}>
      <FormPrimitive
        className={cn("flex w-full flex-col gap-6", className)}
        data-slot="form"
        {...props}
      />
    </FormProvider>
  )
}

export { Form }
