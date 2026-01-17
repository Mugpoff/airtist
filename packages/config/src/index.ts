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
    /**
     * In days
     */
    minBanDuration: 1,
    /**
     * In days
     */
    maxBanDuration: 365,
    /**
     * In days
     */
    defaultBanDuration: 7,
    cookieMaxAge: 7 * 24 * 60 * 60,
    roles: {
      USER: "user",
      ADMIN: "admin",
    },
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
      values: [
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
      ],
      metadata: {
        MAN_BABY: {
          age: { min: 1, max: 3 },
          prompt: "baby boy",
        },
        MAN_CHILD: {
          age: { min: 5, max: 12 },
          prompt: "young boy",
        },
        MAN_PRETEEN: {
          age: { min: 13, max: 15 },
          prompt: "preteen boy",
        },
        MAN_TEEN: {
          age: { min: 16, max: 18 },
          prompt: "teen boy",
        },
        MAN_ADULT: {
          age: { min: 22, max: 99 },
          prompt: "adult man",
        },
        WOMAN_BABY: {
          age: { min: 1, max: 3 },
          prompt: "baby girl",
        },
        WOMAN_CHILD: {
          age: { min: 5, max: 12 },
          prompt: "young girl",
        },
        WOMAN_PRETEEN: {
          age: { min: 13, max: 15 },
          prompt: "preteen girl",
        },
        WOMAN_TEEN: {
          age: { min: 16, max: 18 },
          prompt: "teen girl",
        },
        WOMAN_ADULT: {
          age: { min: 22, max: 99 },
          prompt: "adult woman",
        },
      },
    },
    age: {
      default: 22,
      min: 1,
      max: 99,
    },
    weight: {
      default: 70,
      min: 40,
      max: 200,
    },
    ethnicity: {
      default: "WHITE",
      values: ["WHITE", "BLACK", "ASIAN", "LATINO", "ARAB", "MIXED"],
    },
    background: {
      default: "STUDIO_WHITE",
      values: [
        "STUDIO_WHITE",
        "STUDIO_GREY",
        "STUDIO_DARK_GREY",
        "STUDIO_BLACK",
        "STUDIO_BEIGE",
      ],
    },
    model: {
      default: "google/gemini-3-pro-image-preview",
    },
    prompt: {
      default: "Studio fashion model wearing the outfit",
    },
    acceptedFiles: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "application/zip": [".zip"],
    },
    acceptedImages: new Set(["image/png", "image/jpeg", "image/webp"]),
    studioModes: ["ECOMMERCE", "FASHION"],
  },
} as const

export type GenerationPreset =
  (typeof config.generationSettings.preset.values)[number]
