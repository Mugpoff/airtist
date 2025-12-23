import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { env } from "../env"
import { protectedProcedure } from "../trpc"
import { uploadPng } from "../utils/storage-client"

type OpenRouterResponse = {
  choices?: {
    message?: {
      images?: {
        image_url?: { url?: string }
        imageUrl?: { url?: string }
      }[]
    }
  }[]
  error?: {
    message?: string
  }
}

const ASPECT_RATIO_MAP: Record<string, { width: number; height: number }> = {
  "2:3": { width: 832, height: 1248 },
  "3:2": { width: 1248, height: 832 },
  "3:4": { width: 864, height: 1184 },
  "4:3": { width: 1184, height: 864 },
  "4:5": { width: 896, height: 1152 },
  "5:4": { width: 1152, height: 896 },
  "9:16": { width: 768, height: 1344 },
  "16:9": { width: 1344, height: 768 },
  "21:9": { width: 1536, height: 672 },
}

const DEFAULT_SIZE = { width: 1024, height: 1024 }

const sizeFromAspectRatio = (
  aspectRatio?: string,
): { width: number; height: number } => {
  return (aspectRatio && ASPECT_RATIO_MAP[aspectRatio]) || DEFAULT_SIZE
}

export const imagesGenerateHandler = protectedProcedure
  .input(
    z.object({
      prompt: z.string().trim().min(1),
      model: z.string().trim().optional(),
      aspectRatio: z.string().trim().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const model = input.model || "google/gemini-2.5-flash-image-preview"

    const payload = {
      model,
      messages: [{ role: "user", content: input.prompt }],
      modalities: ["image", "text"],
      stream: false,
      ...(input.aspectRatio
        ? { image_config: { aspect_ratio: input.aspectRatio } }
        : {}),
    }

    const upstream = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": env.OPENROUTER_HTTP_REFERER,
          "X-Title": env.OPENROUTER_APP_TITLE,
        },
        body: JSON.stringify(payload),
      },
    )

    const requestId = upstream.headers.get("x-request-id") ?? ""
    const json = (await upstream
      .json()
      .catch(() => null)) as OpenRouterResponse | null

    if (!upstream.ok) {
      const msg =
        typeof json?.error?.message === "string"
          ? json.error.message
          : "OpenRouter request failed"
      throw new TRPCError({ code: "BAD_GATEWAY", message: msg })
    }

    const img = json?.choices?.[0]?.message?.images?.[0]
    const imageUrl = img?.image_url?.url ?? img?.imageUrl?.url

    if (typeof imageUrl !== "string") {
      throw new TRPCError({
        code: "BAD_GATEWAY",
        message: "No image in OpenRouter response",
      })
    }

    const prefix = "base64,"
    const idx = imageUrl.indexOf(prefix)

    if (idx === -1) {
      throw new TRPCError({
        code: "BAD_GATEWAY",
        message: "Invalid image data URL",
      })
    }

    const b64 = imageUrl.slice(idx + prefix.length)
    const bytes = Buffer.from(b64, "base64")

    const objectKey = `images/${crypto.randomUUID()}.png`
    const publicUrl = await uploadPng(objectKey, bytes)
    const size = sizeFromAspectRatio(input.aspectRatio)

    const row = await db.generatedImages.create({
      data: {
        prompt: input.prompt,
        model,
        requestId: requestId || null,
        aspectRatio: input.aspectRatio ?? null,
        width: size.width,
        height: size.height,
        mimeType: "image/png",
        imageUrl: publicUrl,
        objectKey,
      },
    })

    return { requestId, image: row }
  })
