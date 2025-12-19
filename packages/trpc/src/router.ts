import { generateImageOpenRouterHandler } from "./handlers/generate-image-openrouter-handler"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  generateImageOpenRouter: generateImageOpenRouterHandler,
})

export type AppRouter = typeof appRouter
