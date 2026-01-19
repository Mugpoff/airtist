import { cacheClient } from "@repo/cache"
import { config } from "@repo/config"
import { db } from "@repo/db"
import { sanitizeFileName } from "@repo/utils/sanitize-file-name"
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
  EthnicitySchema,
  StudioBackgroundSchema,
  StudioCategorySchema,
} from "../../utils/studio-constants"


import { zfd } from "zod-form-data"

const parseImageUrls = (v: string | undefined) => {
  if (!v) return []
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

const sha256Hex = (buf: Buffer) =>
  createHash("sha256").update(buf).digest("hex")

const generateStudioSchema = zfd.formData({
  prompt: zfd.text(),
  ethnicity: zfd.text(EthnicitySchema),
  category: zfd.text(StudioCategorySchema),
  background: zfd.text(StudioBackgroundSchema.optional().default("STUDIO_WHITE")),
  model: zfd.text(ImageModelSchema.optional().default(DEFAULT_IMAGE_MODEL)),
  age: zfd.numeric(z.number()),
  height: zfd.numeric(z.number()),
  images: zfd.repeatable(z.array(z.instanceof(File))),
  imageUrls: zfd.text().optional().transform(parseImageUrls),
})

export const imagesGenerateStudioHandler = protectedProcedure
  .input(generateStudioSchema)
  .mutation(async ({ input, ctx }) => {
    const {
      prompt,
      ethnicity,
      category,
      background,
      model,
      age,
      height,
      images: files,
      imageUrls,
    } = input

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
                  const objectKey = `uploads/${crypto.randomUUID()}-${sanitizeFileName(item.fileName)}`
                  return await uploadImage(objectKey, item.buf, item.mimeType)
                }),
              )
            : imageUrls

        const presetPrompt =
          config.generationSettings.preset.metadata[category].prompt
        const ethLabel = ethnicity.toLowerCase()
        const bgPrompt = BACKGROUND_PROMPTS[background]
        const fixedPrompt =
          "Professional high-end fashion photography. Soft lighting."
        const dynamicPrompt = `Full body shot of a ${ethLabel} ${presetPrompt}, ${age}yo, ${height}cm. ${bgPrompt}. ${prompt}`

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
      } catch (error) {
        await pushStatus(jobId, {
          step: "failed",
          error: (error as Error).message,
        })
      }
    })()

    return { jobId }
  })
