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
      default: "white",
      items: [
        { label: "global.ethnicity.white", value: "white" },
        { label: "global.ethnicity.black", value: "black" },
        { label: "global.ethnicity.asian", value: "asian" },
        { label: "global.ethnicity.latino", value: "latino" },
        { label: "global.ethnicity.mixed", value: "mixed" },
      ],
    },
    gender: {
      default: "male",
      items: [
        { label: "global.gender.male", value: "male" },
        { label: "global.gender.female", value: "female" },
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
