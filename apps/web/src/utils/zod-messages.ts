export const zodMessages = {
  name: {
    required: "validation.name.required",
  },
  email: {
    required: "validation.email.required",
    invalid: "validation.email.invalid",
  },
  password: {
    required: "validation.password.required",
    min: "validation.password.min",
  },
  confirmPassword: {
    invalid: "validation.confirmPassword.invalid",
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
