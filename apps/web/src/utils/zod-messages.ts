export const zodMessages = {
  email: {
    required: "validation.email.required",
    invalid: "validation.email.invalid",
  },
  password: {
    required: "validation.password.required",
  },
  gender: {
    invalid: "validation.gender.invalid",
  },
  age: {
    invalid: "validation.age.invalid",
    min: "validation.age.min",
    max: "validation.age.max",
  },
  weight: {
    invalid: "validation.weight.invalid",
    min: "validation.weight.min",
    max: "validation.weight.max",
  },
  ethnicity: {
    invalid: "validation.ethnicity.invalid",
  },
} as const
