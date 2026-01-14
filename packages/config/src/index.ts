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
      values: [
        "MAN_CHILD",
        "MAN_PRETEEN",
        "MAN_TEEN",
        "MAN_ADULT",
        "WOMAN_CHILD",
        "WOMAN_PRETEEN",
        "WOMAN_TEEN",
        "WOMAN_ADULT",
      ],
    },
    age: {
      default: 25,
      min: 1,
      max: 100,
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
    acceptedFiles: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "application/zip": [".zip"],
    },
    acceptedImages: new Set(["image/png", "image/jpeg", "image/webp"]),
  },
} as const
