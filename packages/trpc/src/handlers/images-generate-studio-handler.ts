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
const AspectRatioSchema = z.enum([
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

const ASPECT_RATIO_MAP: Record<
  z.infer<typeof AspectRatioSchema>,
  { width: number; height: number }
> = {
  "1:1": { width: 1024, height: 1024 },
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

type FormDataValue = string | File
const parseNumber = (v: FormDataValue | null) =>
  typeof v === "string" && Number.isFinite(Number(v)) ? Number(v) : null
const parseString = (v: FormDataValue | null) =>
  typeof v === "string" && v.trim() ? v.trim() : null
const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File

const sha256Hex = (buf: Buffer) =>
  createHash("sha256").update(buf).digest("hex")

export const imagesGenerateStudioHandler = protectedProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input, ctx }) => {
    const prompt = parseString(input.get("prompt"))
    const ethnicityRaw = parseString(input.get("ethnicity"))
    const height = parseNumber(input.get("height"))
    const age = parseNumber(input.get("age"))
    const categoryRaw = parseString(input.get("category"))
    const backgroundRaw = parseString(input.get("background"))
    const aspectRatioRaw = parseString(input.get("aspectRatio"))
    const modelRaw = parseString(input.get("model"))

    if (!prompt) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Prompt requis" })
    }

    const ethnicity = EthnicitySchema.parse(ethnicityRaw)
    const category = StudioCategorySchema.parse(categoryRaw)
    const background = StudioBackgroundSchema.parse(
      backgroundRaw ?? "STUDIO_WHITE",
    )
    const aspectRatio = AspectRatioSchema.parse(aspectRatioRaw ?? "1:1")
    const model = ImageModelSchema.parse(modelRaw ?? DEFAULT_IMAGE_MODEL)
    const size = ASPECT_RATIO_MAP[aspectRatio]

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
    if (files.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Images requises" })
    }

    const prepared = await Promise.all(
      files.map(async (file) => {
        const mimeType = file.type || ""
        const buf = Buffer.from(await file.arrayBuffer())
        const digest = sha256Hex(buf)
        return { file, mimeType, buf, digest }
      }),
    )

    const garmentsFingerprint = prepared
      .map((x) => x.digest)
      .sort()
      .join("|")

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
    const redisKey = `studio:hash:${hash}`

    try {
      const cachedId = await cacheClient.metadata.get(redisKey)
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
              aspectRatio: cacheRow.aspectRatio,
              width: cacheRow.width,
              height: cacheRow.height,
              imageUrl: cacheRow.imageUrl,
              objectKey: cacheRow.objectKey,
              mimeType: cacheRow.mimeType,
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
    for (const item of prepared) {
      const objectKey = `uploads/${crypto.randomUUID()}-${item.file.name}`
      const url = await uploadImage(objectKey, item.buf, item.mimeType)
      garmentUrls.push(url)
    }

    const catLabel = STUDIO_CATEGORIES[category].toLowerCase()
    const ethLabel = ethnicity.toLowerCase()
    const bgPrompt = BACKGROUND_PROMPTS[background]

    const system =
      "Professional high-end fashion e-commerce photography. Minimalist studio setting. No props, no furniture, no nature, no street. Focus solely on model and clothing. Lighting must be soft, diffuse, and professional studio strobe."
    const userText = `Subject: Full body shot of a ${ethLabel} ${catLabel}, ${age} years old, ${height}cm tall. Background: ${bgPrompt}. The model is wearing the exact clothing from the reference images. Pose: Neutral fashion pose, standing straight, facing forward or slightly turned. ${prompt}`

    const { bytes, requestId, usage } = await callOpenRouterForImage({
      model,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            ...garmentUrls.map((url) => ({
              type: "image_url",
              image_url: { url },
            })),
          ],
        },
      ],
      imageConfig: { aspect_ratio: aspectRatio },
    })

    const outKey = `images/${crypto.randomUUID()}.png`
    const publicUrl = await uploadImage(outKey, bytes, "image/png")

    const cacheRow = await db.generatedImageCache.upsert({
      where: { hash },
      create: {
        hash,
        prompt: userText,
        model,
        requestId,
        aspectRatio,
        width: size.width,
        height: size.height,
        imageUrl: publicUrl,
        objectKey: outKey,
        mimeType: "image/png",
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
        cachedTokens: usage?.prompt_tokens_details?.cached_tokens,
        cost: usage?.cost != null ? String(usage.cost) : null,
      },
      update: {
        prompt: userText,
        model,
        requestId,
        aspectRatio,
        width: size.width,
        height: size.height,
        imageUrl: publicUrl,
        objectKey: outKey,
        mimeType: "image/png",
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
        cachedTokens: usage?.prompt_tokens_details?.cached_tokens,
        cost: usage?.cost != null ? String(usage.cost) : null,
      },
    })

    const historyRow = await db.generatedImages.create({
      data: {
        prompt: userText,
        model,
        requestId,
        aspectRatio,
        width: size.width,
        height: size.height,
        mimeType: "image/png",
        imageUrl: publicUrl,
        objectKey: outKey,
        userId: ctx.session.user.id,
        cacheKey: cacheRow.id,
      },
    })

    try {
      await cacheClient.metadata.set(redisKey, cacheRow.id, 60 * 60 * 24 * 7)
    } catch {}

    return { image: historyRow, garmentUrls, usage }
  })
