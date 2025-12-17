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
} as const
