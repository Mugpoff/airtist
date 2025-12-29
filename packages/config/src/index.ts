export const config = {
  general: {
    name: "AI Picture",
    description: "Generate stunning AI-powered images with ease",
    url: "https://aipicture.app",
  },
  metadata: {
    keywords: [
      "AI",
      "image generation",
      "artificial intelligence",
      "pictures",
    ] as string[],
    author: "AI Picture Team",
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
      items: [
        { label: "global.preset.manChild", value: "MAN_CHILD" },
        { label: "global.preset.manPreteen", value: "MAN_PRETEEN" },
        { label: "global.preset.manTeen", value: "MAN_TEEN" },
        { label: "global.preset.manAdult", value: "MAN_ADULT" },
        { label: "global.preset.womanChild", value: "WOMAN_CHILD" },
        { label: "global.preset.womanPreteen", value: "WOMAN_PRETEEN" },
        { label: "global.preset.womanTeen", value: "WOMAN_TEEN" },
        { label: "global.preset.womanAdult", value: "WOMAN_ADULT" },
      ],
    },
    weight: {
      default: 70,
      min: 40,
      max: 200,
    },
    ethnicity: {
      default: "white",
      items: [
        { label: "global.ethnicity.white", value: "white" },
        { label: "global.ethnicity.black", value: "black" },
        { label: "global.ethnicity.asian", value: "asian" },
        { label: "global.ethnicity.latino", value: "latino" },
        { label: "global.ethnicity.mixed", value: "mixed" },
      ],
    },
    background: {
      default: "STUDIO_WHITE",
      items: [
        { label: "global.background.studioWhite", value: "STUDIO_WHITE" },
        { label: "global.background.studioGrey", value: "STUDIO_GREY" },
        {
          label: "global.background.studioDarkGrey",
          value: "STUDIO_DARK_GREY",
        },
        { label: "global.background.studioBlack", value: "STUDIO_BLACK" },
        { label: "global.background.studioBeige", value: "STUDIO_BEIGE" },
      ],
    },
    acceptedFiles: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "application/zip": [".zip"],
    },
  },
} as const
