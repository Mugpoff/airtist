import { z } from "zod"
import { generateImageHandler } from "../handlers/generate-image-handler"
import { createTRPCRouter, publicProcedure } from "../trpc"

export const imageRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        model: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await generateImageHandler(input)
      return result
    }),
})
