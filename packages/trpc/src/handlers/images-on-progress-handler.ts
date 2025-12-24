import { tracked } from "@trpc/server"
import { z } from "zod"
import { publicProcedure } from "../trpc"
import { ee, type GenerationProgress } from "../utils/event-emitter"

export const imagesOnProgressHandler = publicProcedure
  .input(
    z.object({
      requestId: z.string(),
      lastEventId: z.string().optional(),
    }),
  )
  .subscription(async function* (opts) {
    const { requestId } = opts.input

    const iterable = ee.toIterable(`progress:${requestId}`, {
      signal: opts.signal,
    })

    for await (const [data] of iterable) {
      const progress = data as GenerationProgress

      yield tracked(progress.step, progress)

      if (progress.step === "COMPLETED" || progress.step === "FAILED") {
        break
      }
    }
  })
