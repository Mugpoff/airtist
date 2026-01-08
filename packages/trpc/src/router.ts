import { on } from "node:events"
import { cacheClient } from "@repo/cache"
import { z } from "zod"
import { imagesByIdHandler } from "./handlers/images-by-id-handler"
import { imagesDeleteHandler } from "./handlers/images-delete-handler"
import { imagesGenerateStudioHandler } from "./handlers/images-generate-studio-handler"
import { imagesListHandler } from "./handlers/images-list-handler"
import { imagesModelsHandler } from "./handlers/images-models-handler"
import { pingHandler } from "./handlers/ping-handler"
import { driveRouter } from "./routers/drive"
import { createTRPCRouter, protectedProcedure } from "./trpc"
import { getJobHistory } from "./utils/redis-stream"

const getRedis = () => cacheClient.getClient()

export const appRouter = createTRPCRouter({
  ping: pingHandler,
  images: createTRPCRouter({
    list: imagesListHandler,
    byId: imagesByIdHandler,
    generateStudio: imagesGenerateStudioHandler,
    delete: imagesDeleteHandler,
    models: imagesModelsHandler,
  }),
  drive: driveRouter,
  onGenerateProgress: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .subscription(async function* ({ input, signal }) {
      const { jobId } = input

      const history = await getJobHistory(jobId)
      for (const event of history) {
        yield event
      }

      const sub = getRedis().duplicate()
      await sub.subscribe(`job:${jobId}:events`)

      try {
        const iterable = on(sub, "message")
        for await (const [, message] of iterable) {
          if (signal?.aborted) break
          yield JSON.parse(message)
        }
      } finally {
        await sub.quit()
      }
    }),
})

export type AppRouter = typeof appRouter
