import OpenAI from "openai"
import { z } from "zod"
import { protectedProcedure } from "../trpc"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateImageOpenAIHandler = protectedProcedure
  .input(
    z.object({
      prompt: z.string().min(1),
      size: z
        .enum(["1024x1024", "1024x1536", "1536x1024"])
        .default("1024x1024"),
      quality: z.enum(["low", "medium", "high", "auto"]).default("auto"),
    }),
  )
  .mutation(async ({ input }) => {
    const res = await openai.images.generate({
      model: "gpt-image-1.5",
      prompt: input.prompt,
      size: input.size,
      quality: input.quality,
    })

    const b64 = res.data?.[0]?.b64_json

    if (!b64) {
      throw new Error("OpenAI did not return image data")
    }

    return {
      dataUrl: `data:image/png;base64,${b64}`,
    }
  })
