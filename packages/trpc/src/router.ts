import { imageRouter } from "./routers/image-router"
import { createTRPCRouter, mergeRouters, publicProcedure } from "./trpc"

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => "ok"),
  image: mergeRouters(imageRouter),
})

export type AppRouter = typeof appRouter
