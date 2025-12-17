export const config = {
  general: {
    name: "AI Picture",
    description: "Generate stunning AI-powered images with ease",
    url: "https://aipicture.app",
  },
  metadata: {
    keywords: ["AI", "image generation", "artificial intelligence", "pictures"],
    author: "AI Picture Team",
  },
  env: {
    isSeed: !!process.env.SEED,
    isProduction: process.env.NODE_ENV === "production",
  },
  auth: {
    cookieMaxAge: 7 * 24 * 60 * 60,
  },
}
