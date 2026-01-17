export const zodMessages = {
  email: {
    required: "validation.email.required",
    invalid: "validation.email.invalid",
  },
  password: {
    required: "validation.password.required",
  },
  preset: {
    invalid: "validation.preset.invalid",
  },
  background: {
    invalid: "validation.background.invalid",
  },
  weight: {
    invalid: "validation.weight.invalid",
    min: "validation.weight.min",
    max: "validation.weight.max",
  },
  ethnicity: {
    invalid: "validation.ethnicity.invalid",
  },
  duration: {
    min: "validation.duration.min",
    max: "validation.duration.max",
  },
} as const
