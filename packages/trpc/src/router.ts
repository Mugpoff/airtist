import { generateImageHandler } from "./handlers/generate-image-handler"
import { generateImageOpenAIHandler } from "./handlers/generate-image-openai-handler"
import { generateImageOpenRouterHandler } from "./handlers/generate-image-openrouter-handler"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  images: {
    generate: generateImageHandler,
    generateOpenRouter: generateImageOpenRouterHandler,
    generateOpenAI: generateImageOpenAIHandler,
  },
})

export type AppRouter = typeof appRouter
