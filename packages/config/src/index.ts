export type AgeRange = { min: number; max: number }

export const GENERATION_PRESETS = [
  "MAN_BABY",
  "MAN_CHILD",
  "MAN_PRETEEN",
  "MAN_TEEN",
  "MAN_ADULT",
  "WOMAN_BABY",
  "WOMAN_CHILD",
  "WOMAN_PRETEEN",
  "WOMAN_TEEN",
  "WOMAN_ADULT",
] as const

export const ETHNICITY_VALUES = [
  "WHITE",
  "BLACK",
  "ASIAN",
  "LATINO",
  "ARAB",
  "MIXED",
] as const

export const BACKGROUND_VALUES = [
  "STUDIO_WHITE",
  "STUDIO_GREY",
  "STUDIO_DARK_GREY",
  "STUDIO_BLACK",
  "STUDIO_BEIGE",
] as const

export type GenerationPreset = (typeof GENERATION_PRESETS)[number]

export const PRESET_METADATA = {
  MAN_BABY: { label: "Garçon (Bébé)", ageRange: { min: 1, max: 3 } },
  MAN_CHILD: { label: "Garçon (Enfant)", ageRange: { min: 5, max: 12 } },
  MAN_PRETEEN: {
    label: "Garçon (Pré-adolescent)",
    ageRange: { min: 13, max: 15 },
  },
  MAN_TEEN: { label: "Homme (Adolescent)", ageRange: { min: 16, max: 18 } },
  MAN_ADULT: { label: "Homme (Adulte)", ageRange: { min: 22, max: 99 } },
  WOMAN_BABY: { label: "Fille (Bébé)", ageRange: { min: 1, max: 3 } },
  WOMAN_CHILD: { label: "Fille (Enfant)", ageRange: { min: 5, max: 12 } },
  WOMAN_PRETEEN: {
    label: "Fille (Pré-adolescente)",
    ageRange: { min: 13, max: 15 },
  },
  WOMAN_TEEN: {
    label: "Femme (Adolescente)",
    ageRange: { min: 16, max: 18 },
  },
  WOMAN_ADULT: { label: "Femme (Adulte)", ageRange: { min: 22, max: 99 } },
} satisfies Record<GenerationPreset, { label: string; ageRange: AgeRange }>

type ConfigShape = {
  general: {
    name: string
    description: string
    url: string
  }
  metadata: {
    keywords: readonly string[]
    author: string
  }
  env: {
    isSeed: boolean
    isDevelopment: boolean
    isProduction: boolean
  }
  auth: {
    minPasswordLength: number
    maxPasswordLength: number
    cookieMaxAge: number
  }
  i18n: {
    availableLocales: readonly string[]
    defaultLocale: string
    cookie: {
      name: string
      maxAge: number
    }
  }
  generationSettings: {
    preset: {
      default: GenerationPreset
      values: readonly GenerationPreset[]
    }
    age: {
      default: number
      min: number
      max: number
    }
    weight: {
      default: number
      min: number
      max: number
    }
    ethnicity: {
      default: string
      values: readonly string[]
    }
    background: {
      default: string
      values: readonly string[]
    }
    model: {
      default: string
    }
    prompt: {
      default: string
    }
    acceptedFiles: Record<string, readonly string[]>
    acceptedImages: ReadonlySet<string>
  }
}

export const config = {
  general: {
    name: "Airtist",
    description: "Generate stunning AI-powered images with ease",
    url: "https://studio.regardbeauty.xyz",
  },
  metadata: {
    keywords: [
      "AI",
      "image generation",
      "artificial intelligence",
      "pictures",
    ] as string[],
    author: "Airtist Team",
  },
  env: {
    isSeed: !!process.env.SEED,
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },
  auth: {
    minPasswordLength: 8,
    maxPasswordLength: 50,
    cookieMaxAge: 7 * 24 * 60 * 60,
  },
  i18n: {
    availableLocales: ["en", "fr"],
    defaultLocale: "en",
    cookie: {
      name: "Language",
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  generationSettings: {
    preset: {
      default: "MAN_ADULT",
      values: GENERATION_PRESETS,
    } satisfies ConfigShape["generationSettings"]["preset"],
    age: {
      default: 22,
      min: 1,
      max: 99,
    } satisfies ConfigShape["generationSettings"]["age"],
    weight: {
      default: 70,
      min: 40,
      max: 200,
    } satisfies ConfigShape["generationSettings"]["weight"],
    ethnicity: {
      default: "WHITE",
      values: ETHNICITY_VALUES,
    } satisfies ConfigShape["generationSettings"]["ethnicity"],
    background: {
      default: "STUDIO_WHITE",
      values: BACKGROUND_VALUES,
    } satisfies ConfigShape["generationSettings"]["background"],
    model: {
      default: "google/gemini-3-pro-image-preview",
    } satisfies ConfigShape["generationSettings"]["model"],
    prompt: {
      default: "Studio fashion model wearing the outfit",
    } satisfies ConfigShape["generationSettings"]["prompt"],
    acceptedFiles: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "application/zip": [".zip"],
    } satisfies ConfigShape["generationSettings"]["acceptedFiles"],
    acceptedImages: new Set(["image/png", "image/jpeg", "image/webp"]),
  } satisfies ConfigShape["generationSettings"],
} satisfies ConfigShape

export const STUDIO_MODES = ["ECOMMERCE", "FASHION"] as const

export const VALIDATION_ERROR_CODES = [
  "AGE_OUT_OF_RANGE",
  "PROMPT_AGE_OUT_OF_RANGE",
  "PROMPT_CONFLICT",
] as const

export type StudioMode = (typeof STUDIO_MODES)[number]
export type ValidationErrorCode = (typeof VALIDATION_ERROR_CODES)[number]
