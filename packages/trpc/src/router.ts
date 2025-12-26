import { imagesByIdHandler } from "./handlers/images-by-id-handler"
import { imagesDeleteHandler } from "./handlers/images-delete-handler"
import { imagesGenerateHandler } from "./handlers/images-generate-handler"
import { imagesGenerateStudioHandler } from "./handlers/images-generate-studio-handler"
import { imagesListHandler } from "./handlers/images-list-handler"
import { imagesOnProgressHandler } from "./handlers/images-on-progress-handler"
import { pingHandler } from "./handlers/ping-handler"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ping: pingHandler,
  images: createTRPCRouter({
    list: imagesListHandler,
    byId: imagesByIdHandler,
    generate: imagesGenerateHandler,
    generateStudio: imagesGenerateStudioHandler,
    delete: imagesDeleteHandler,
    onProgress: imagesOnProgressHandler,
  }),
})

export type AppRouter = typeof appRouter
