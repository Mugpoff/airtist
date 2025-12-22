import { imagesByIdHandler } from "./handlers/images-by-id-handler"
import { imagesGenerateHandler } from "./handlers/images-generate-handler"
import { imagesListHandler } from "./handlers/images-list-handler"
import { pingHandler } from "./handlers/ping-handler"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ping: pingHandler,
  images: createTRPCRouter({
    list: imagesListHandler,
    byId: imagesByIdHandler,
    generate: imagesGenerateHandler,
  }),
})

export type AppRouter = typeof appRouter
