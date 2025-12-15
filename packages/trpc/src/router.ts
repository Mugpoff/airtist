import { generateImage } from "./handlers/generate-image"
import { createTRPCRouter, publicProcedure } from "./trpc"

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => "ok"),
  generateImage: generateImage,
})

export type AppRouter = typeof appRouter
