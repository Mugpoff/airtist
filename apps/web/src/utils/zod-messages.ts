import type { InferNestedValues } from "./infer-nested-values"

export const zodMessages = {
  email: {
    required: "validation.email.required",
    invalid: "validation.email.invalid",
  },
  password: {
    required: "validation.password.required",
  },
} as const

export type ZodMessages = InferNestedValues<typeof zodMessages>
