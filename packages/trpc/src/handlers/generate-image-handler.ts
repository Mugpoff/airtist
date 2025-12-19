import z from "zod"
import { protectedProcedure } from "../trpc"

const generateImageInputSchema = z.object({
  prompt: z.string().min(1),
  model: z.string().min(1),
})

export const generateImageHandler = protectedProcedure
  .input(generateImageInputSchema)
  .mutation(async ({ input, ctx: { openRouter } }) => {
    const response = await openRouter.chat.send({
      model: input.model,
      messages: [
        {
          role: "user",
          content: `Generate an image and return only a direct URL to the final image.\n\nPrompt: ${input.prompt}`,
        },
      ],
      stream: false,
    })

    const choice = response.choices[0]
    const content = choice?.message.content

    if (!content || typeof content !== "string") {
      throw new Error("Model did not return an image URL")
    }

    return {
      imageUrl: content.trim(),
    }
  })
