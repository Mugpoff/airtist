import { createHash } from "node:crypto"
import { cacheClient } from "@repo/cache"
import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../../trpc"
import { generateStudioHash, type StudioHashInput } from "../../utils/hash"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../../utils/image-models"
import { callOpenRouterForImage } from "../../utils/openrouter-image"
import { pushStatus } from "../../utils/redis-stream"
import { uploadImage } from "../../utils/storage-client"
import {
  BACKGROUND_PROMPTS,
  STUDIO_CATEGORIES,
  StudioBackgroundSchema,
  StudioCategorySchema,
} from "../../utils/studio-constants"

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
    const ethnicity = EthnicitySchema.parse(input.get("ethnicity"))
    const category = StudioCategorySchema.parse(input.get("category"))
    const background = StudioBackgroundSchema.parse(
      input.get("background") ?? "STUDIO_WHITE",
    )
    const model = ImageModelSchema.parse(
      input.get("model") ?? DEFAULT_IMAGE_MODEL,
    )

    const ageNum = parseNumber(input.get("age"))
    const heightNum = parseNumber(input.get("height"))

    if (!prompt || ageNum === null || heightNum === null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Paramètres manquants",
      })
    }

    const age = ageNum
    const height = heightNum

    const files = input.getAll("images").filter(isFile)
    const imageUrls = parseStringArray(input.get("imageUrls"))

    if (files.length === 0 && imageUrls.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Images requises" })
    }

    const prepared = await Promise.all(
      files.map(async (file) => {
        const buf = Buffer.from(await file.arrayBuffer())
        return {
          fileName: file.name,
          mimeType: file.type,
          buf,
          digest: sha256Hex(buf),
        }
      }),
    )

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
      aspectRatio: "1:1",
      garmentsFingerprint,
    }
    const hash = generateStudioHash(hashInput)

    const cachedId = await cacheClient.images.cacheIdByHash.get(hash)
    if (cachedId) {
      const cacheRow = await db.generatedImageCache.findUnique({
        where: { id: cachedId },
      })
      if (cacheRow) {
        const image = await db.generatedImages.create({
          data: {
            prompt: cacheRow.prompt,
            model: cacheRow.model,
            imageUrl: cacheRow.imageUrl,
            userId: ctx.session.user.id,
            cacheKey: cacheRow.id,
            width: cacheRow.width,
            height: cacheRow.height,
            aspectRatio: cacheRow.aspectRatio,
            mimeType: cacheRow.mimeType,
          },
        })
        return { image, jobId: null }
      }
    }

    const jobId = crypto.randomUUID()

    ;(async () => {
      try {
        await pushStatus(jobId, { step: "started" })

        const garmentUrls =
          prepared.length > 0
            ? await Promise.all(
                prepared.map(async (item) => {
                  const objectKey = `uploads/${crypto.randomUUID()}-${item.fileName}`
                  return await uploadImage(objectKey, item.buf, item.mimeType)
                }),
              )
            : imageUrls

        const catLabel = STUDIO_CATEGORIES[category].toLowerCase()
        const ethLabel = ethnicity.toLowerCase()
        const bgPrompt = BACKGROUND_PROMPTS[background]
        const fixedPrompt =
          "Professional high-end fashion photography. Soft lighting."
        const dynamicPrompt = `Full body shot of a ${ethLabel} ${catLabel}, ${age}yo, ${height}cm. ${bgPrompt}. ${prompt}`

        await pushStatus(jobId, { step: "generating" })

        const result = await callOpenRouterForImage({
          model,
          messages: [
            { role: "system", content: [{ type: "text", text: fixedPrompt }] },
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
          imageConfig: { aspect_ratio: "1:1" },
        })

        await pushStatus(jobId, { step: "uploading" })

        const outKey = `images/${crypto.randomUUID()}.png`
        const publicUrl = await uploadImage(outKey, result.bytes, "image/png")

        await db.generatedImages.create({
          data: {
            prompt: dynamicPrompt,
            model,
            width: 1024,
            height: 1024,
            imageUrl: publicUrl,
            userId: ctx.session.user.id,
            mimeType: "image/png",
          },
        })

        await pushStatus(jobId, { step: "completed", imageUrl: publicUrl })
      } catch (error: any) {
        await pushStatus(jobId, { step: "failed", error: error.message })
      }
    })()

    return { jobId }
  })
