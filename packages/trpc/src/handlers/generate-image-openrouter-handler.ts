import { z } from "zod"
import { protectedProcedure } from "../trpc"

const OpenRouterImage = z.object({
  image_url: z.object({
    url: z.string(),
  }),
})

const OpenRouterResponse = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        images: z.array(OpenRouterImage).optional(),
      }),
    }),
  ),
})

export const generateImageOpenRouterHandler = protectedProcedure
  .input(
    z.object({
      prompt: z.string().min(1),
      model: z.string().default("google/gemini-2.5-flash-image-preview"),
      aspectRatio: z
        .enum([
          "1:1",
          "2:3",
          "3:2",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "9:16",
          "16:9",
          "21:9",
        ])
        .optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is missing")
    }

    const body = {
      model: input.model,
      messages: [{ role: "user", content: input.prompt }],
      modalities: ["image", "text"],
      stream: false,
      ...(input.aspectRatio
        ? { image_config: { aspect_ratio: input.aspectRatio } }
        : {}),
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const json = await res.json()

    if (!res.ok) {
      if (
        typeof json === "object" &&
        json !== null &&
        "error" in json &&
        typeof json.error === "object" &&
        json.error !== null &&
        "message" in json.error &&
        typeof json.error.message === "string"
      ) {
        throw new Error(json.error.message)
      }

      throw new Error("OpenRouter request failed")
    }

    const parsed = OpenRouterResponse.parse(json)
    const imageUrl =
      parsed.choices[0]?.message.images?.[0]?.image_url.url ?? null

    if (!imageUrl) {
      throw new Error("OpenRouter did not return an image")
    }

    return { imageUrl }
  })
