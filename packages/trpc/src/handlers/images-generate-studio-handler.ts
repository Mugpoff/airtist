import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../trpc"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../utils/image-models"
import { callOpenRouterForImage } from "../utils/openrouter-image"
import { uploadImage } from "../utils/storage-client"

const EthnicitySchema = z.enum(["ASIAN", "BLACK", "ARAB", "WHITE"])

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

const parseNumber = (value: FormDataValue | null) => {
  if (typeof value !== "string") return null
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  return n
}

const parseString = (value: FormDataValue | null) => {
  if (typeof value !== "string") return null
  const s = value.trim()
  return s.length ? s : null
}

const isFile = (v: unknown): v is File => {
  return typeof File !== "undefined" && v instanceof File
}

const extFromMime = (mime: string) => {
  if (mime === "image/png") return "png"
  if (mime === "image/jpeg") return "jpg"
  if (mime === "image/webp") return "webp"
  if (mime === "image/avif") return "avif"
  if (mime === "image/heic") return "heic"
  return "bin"
}

export const imagesGenerateStudioHandler = protectedProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input }) => {
    const prompt = parseString(input.get("prompt") as FormDataValue | null)
    const ethnicityRaw = parseString(
      input.get("ethnicity") as FormDataValue | null,
    )
    const height = parseNumber(input.get("height") as FormDataValue | null)
    const age = parseNumber(input.get("age") as FormDataValue | null)
    const aspectRatioRaw = parseString(
      input.get("aspectRatio") as FormDataValue | null,
    )
    const modelRaw = parseString(input.get("model") as FormDataValue | null)

    if (!prompt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "prompt is required",
      })
    }

    const ethnicity = EthnicitySchema.safeParse(ethnicityRaw)
    if (!ethnicity.success) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "invalid ethnicity" })
    }

    if (height == null || height < 1 || height > 230) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "invalid height" })
    }

    if (age == null || age < 1 || age > 100) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "invalid age" })
    }

    const aspectRatioParsed = AspectRatioSchema.safeParse(
      aspectRatioRaw ?? "1:1",
    )
    if (!aspectRatioParsed.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "invalid aspectRatio",
      })
    }
    const aspectRatio = aspectRatioParsed.data
    const size = ASPECT_RATIO_MAP[aspectRatio]

    const modelParsed = ImageModelSchema.safeParse(
      modelRaw ?? DEFAULT_IMAGE_MODEL,
    )
    if (!modelParsed.success) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "invalid model" })
    }
    const model = modelParsed.data

    const files = input.getAll("images").filter((v): v is File => isFile(v))
    if (files.length < 1) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "at least one image is required",
      })
    }

    const garmentUrls: string[] = []

    for (const file of files) {
      const mimeType = typeof file.type === "string" ? file.type : ""
      const buf = Buffer.from(await file.arrayBuffer())
      const ext = extFromMime(mimeType)
      const objectKey = `uploads/${crypto.randomUUID()}-${file.name || `image.${ext}`}`
      const url = await uploadImage(objectKey, buf, mimeType)
      garmentUrls.push(url)
    }

    const system = [
      "You are a professional fashion photography generator.",
      "Generate a high-quality studio photograph of a single fashion model.",
      "Full body, centered, neutral pose, clean background, soft studio lighting.",
      "The model must wear exactly the clothing shown in the reference images.",
      "Do not change clothing design, colors, logos, patterns, or materials.",
      "No extra people, no text, no watermark, no blur.",
    ].join("\n")

    const userText = [
      `Model attributes: ethnicity=${ethnicity.data}, age=${age}, height_cm=${height}.`,
      `User prompt: ${prompt}`,
      "Use the provided reference images as the clothing to be worn by the model.",
    ].join("\n")

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          ...garmentUrls.map((u) => ({
            type: "image_url",
            image_url: { url: u },
          })),
        ],
      },
    ]

    const { bytes, requestId, usage } = await callOpenRouterForImage({
      model,
      messages,
      imageConfig: { aspect_ratio: aspectRatio },
    })

    const outObjectKey = `images/${crypto.randomUUID()}.png`
    const publicUrl = await uploadImage(outObjectKey, bytes, "image/png")

    const row = await db.generatedImages.create({
      data: {
        prompt: userText,
        model,
        requestId: requestId || null,
        aspectRatio,
        width: size.width,
        height: size.height,
        mimeType: "image/png",
        imageUrl: publicUrl,
        objectKey: outObjectKey,
      },
    })

    return {
      image: row,
      garmentUrls,
      usage,
    }
  })
