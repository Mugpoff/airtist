import { on } from "node:events"
import { rawCacheClient } from "@repo/cache"
import { z } from "zod"
import { pingHandler } from "./handlers/ping-handler"
import { adminRouter } from "./routers/admin"
import { driveRouter } from "./routers/drive"
import { imagesRouter } from "./routers/images"
import { createTRPCRouter, protectedProcedure } from "./trpc"
import { getJobHistory } from "./utils/redis-stream"

export const appRouter = createTRPCRouter({
  ping: pingHandler,
  admin: adminRouter,
  images: imagesRouter,
  drive: driveRouter,
  onGenerateProgress: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .subscription(async function* ({ input, signal }) {
      const { jobId } = input

      const history = await getJobHistory(jobId)
      for (const event of history) {
        yield event
      }

      const sub = rawCacheClient().duplicate()
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
