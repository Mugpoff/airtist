import { createHash } from "node:crypto"
import { cacheClient } from "@repo/cache"
import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../trpc"
import { generateStudioHash, type StudioHashInput } from "../utils/hash"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../utils/image-models"
import { callOpenRouterForImage } from "../utils/openrouter-image"
import { uploadImage } from "../utils/storage-client"
import {
  BACKGROUND_PROMPTS,
  STUDIO_AGE_RANGES,
  STUDIO_CATEGORIES,
  StudioBackgroundSchema,
  StudioCategorySchema,
} from "../utils/studio-constants"

const EthnicitySchema = z.enum([
  "ASIAN",
  "BLACK",
  "ARAB",
  "WHITE",
  "LATINO",
  "METISSE",
])

type FormDataValue = string | File
const parseNumber = (v: FormDataValue | null) =>
  typeof v === "string" && Number.isFinite(Number(v)) ? Number(v) : null
const parseString = (v: FormDataValue | null) =>
  typeof v === "string" && v.trim() ? v.trim() : null
const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File

const sha256Hex = (buf: Buffer) =>
  createHash("sha256").update(buf).digest("hex")

const parseStringArray = (v: FormDataValue | null) => {
  if (typeof v !== "string") return []
  try {
    const parsed = JSON.parse(v)
    return Array.isArray(parsed) && parsed.every((x) => typeof x === "string")
      ? parsed
      : []
  } catch {
    return v
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  }
}

export const imagesGenerateStudioHandler = protectedProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input, ctx }) => {
    const prompt = parseString(input.get("prompt"))
    const ethnicityRaw = parseString(input.get("ethnicity"))
    const height = parseNumber(input.get("height"))
    const age = parseNumber(input.get("age"))
    const categoryRaw = parseString(input.get("category"))
    const backgroundRaw = parseString(input.get("background"))
    const modelRaw = parseString(input.get("model"))

    if (!prompt) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Prompt requis" })
    }

    const ethnicity = EthnicitySchema.parse(ethnicityRaw)
    const category = StudioCategorySchema.parse(categoryRaw)
    const background = StudioBackgroundSchema.parse(
      backgroundRaw ?? "STUDIO_WHITE",
    )
    const model = ImageModelSchema.parse(modelRaw ?? DEFAULT_IMAGE_MODEL)

    const aspectRatio = "1:1"
    const width = 1024
    const canvasHeight = 1024

    const range = STUDIO_AGE_RANGES[category]
    if (age === null || age < range.min || age > range.max) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `L'âge pour cette catégorie doit être entre ${range.min} et ${range.max} ans.`,
      })
    }

    if (height === null || height < 50 || height > 230) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Taille invalide" })
    }

    const files = input.getAll("images").filter(isFile)
    const imageUrls = parseStringArray(input.get("imageUrls"))

    if (files.length === 0 && imageUrls.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Images requises",
      })
    }

    const prepared =
      files.length > 0
        ? await Promise.all(
            files.map(async (file) => {
              const mimeType = file.type || ""
              const buf = Buffer.from(await file.arrayBuffer())
              const digest = sha256Hex(buf)
              return { fileName: file.name, mimeType, buf, digest }
            }),
          )
        : []

    const garmentsFingerprint =
      prepared.length > 0
        ? prepared
            .map((x) => x.digest)
            .sort()
            .join("|")
        : imageUrls.slice().sort().join("|")

    const hashInput: StudioHashInput & { garmentsFingerprint: string } = {
      prompt,
      model,
      category,
      background,
      ethnicity,
      age,
      height,
      aspectRatio,
      garmentsFingerprint,
    }

    const hash = generateStudioHash(hashInput)

    try {
      const cachedId = await cacheClient.images.cacheIdByHash.get(hash)
      if (cachedId) {
        const cacheRow = await db.generatedImageCache.findUnique({
          where: { id: cachedId },
        })

        if (cacheRow) {
          const historyRow = await db.generatedImages.create({
            data: {
              prompt: cacheRow.prompt,
              model: cacheRow.model,
              requestId: cacheRow.requestId,
              imageUrl: cacheRow.imageUrl,
              objectKey: cacheRow.objectKey,
              mimeType: cacheRow.mimeType,
              width: cacheRow.width,
              height: cacheRow.height,
              aspectRatio: cacheRow.aspectRatio,
              promptTokens: cacheRow.promptTokens,
              completionTokens: cacheRow.completionTokens,
              totalTokens: cacheRow.totalTokens,
              cachedTokens: cacheRow.cachedTokens,
              cost: cacheRow.cost,
              userId: ctx.session.user.id,
              cacheKey: cacheRow.id,
            },
          })

          return { image: historyRow, garmentUrls: [], usage: null }
        }
      }
    } catch {}

    const garmentUrls: string[] = []

    if (prepared.length > 0) {
      for (const item of prepared) {
        const objectKey = `uploads/${crypto.randomUUID()}-${item.fileName}`
        const url = await uploadImage(objectKey, item.buf, item.mimeType)
        garmentUrls.push(url)
      }
    } else {
      garmentUrls.push(...imageUrls)
    }

    const catLabel = STUDIO_CATEGORIES[category].toLowerCase()
    const ethLabel = ethnicity.toLowerCase()
    const bgPrompt = BACKGROUND_PROMPTS[background]

    const fixedPrompt =
      "Professional high-end fashion e-commerce photography. Minimalist studio setting. No props, no furniture, no nature, no street. Focus solely on model and clothing. Lighting must be soft, diffuse, and professional studio strobe."
    const dynamicPrompt = `Subject: Full body shot of a ${ethLabel} ${catLabel}, ${age} years old, ${height}cm tall. Background: ${bgPrompt}. The model is wearing the exact clothing from the reference images. Pose: Neutral fashion pose, standing straight, facing forward or slightly turned. ${prompt}`

    const cacheInput = {
      prompt: {
        fixed: fixedPrompt,
        dynamic: dynamicPrompt,
      },
      studio: {
        ethnicity,
        category,
        background,
        age,
        height,
      },
      model,
      garments: {
        fingerprints:
          prepared.length > 0 ? prepared.map((x) => x.digest).sort() : [],
        urls: prepared.length === 0 ? imageUrls.slice().sort() : [],
      },
    }

    const { bytes, requestId, usage } = await callOpenRouterForImage({
      model,
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: fixedPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "text", text: dynamicPrompt },
            ...garmentUrls.map((url) => ({
              type: "image_url",
              image_url: { url },
            })),
          ],
        },
      ],
      imageConfig: {
        aspect_ratio: aspectRatio,
      },
    })

    const outKey = `images/${crypto.randomUUID()}.png`
    const publicUrl = await uploadImage(outKey, bytes, "image/png")

    const cacheRow = await db.generatedImageCache.upsert({
      where: { hash },
      create: {
        hash,
        prompt: dynamicPrompt,
        input: cacheInput,
        model,
        requestId,
        imageUrl: publicUrl,
        objectKey: outKey,
        mimeType: "image/png",
        aspectRatio,
        width,
        height: canvasHeight,
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
        cachedTokens: usage?.prompt_tokens_details?.cached_tokens,
        cost: usage?.cost != null ? String(usage.cost) : null,
      },
      update: {
        prompt: dynamicPrompt,
        input: cacheInput,
        model,
        requestId,
        imageUrl: publicUrl,
        objectKey: outKey,
        mimeType: "image/png",
        aspectRatio,
        width,
        height: canvasHeight,
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
        cachedTokens: usage?.prompt_tokens_details?.cached_tokens,
        cost: usage?.cost != null ? String(usage.cost) : null,
      },
    })

    const historyRow = await db.generatedImages.create({
      data: {
        prompt: dynamicPrompt,
        model,
        requestId,
        mimeType: "image/png",
        imageUrl: publicUrl,
        objectKey: outKey,
        width,
        height: canvasHeight,
        aspectRatio,
        userId: ctx.session.user.id,
        cacheKey: cacheRow.id,
      },
    })

    try {
      await cacheClient.images.cacheIdByHash.set(
        hash,
        cacheRow.id,
        60 * 60 * 24 * 7,
      )
    } catch {}

    return { image: historyRow, garmentUrls, usage }
  })
