import { z } from "zod"
import { publicProcedure } from "../trpc"

export const generateImage = publicProcedure
  .input(
    z.object({
      prompt: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    // @ts-expect-error - OpenRouter is not typed
    const result = await openRouter.images.generate({
      model: "nano-banana-pro",
      prompt: input.prompt,
    })

    return result.toDataStreamResponse()
  })
