import { db } from "@repo/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../trpc"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../utils/image-models"
import { callOpenRouterForImage } from "../utils/openrouter-image"
import { uploadImage } from "../utils/storage-client"
import {
  STUDIO_AGE_RANGES,
  STUDIO_CATEGORIES,
  StudioCategorySchema,
} from "../utils/studio-constants"

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
const parseNumber = (v: FormDataValue | null) =>
  typeof v === "string" && Number.isFinite(Number(v)) ? Number(v) : null
const parseString = (v: FormDataValue | null) =>
  typeof v === "string" && v.trim() ? v.trim() : null
const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File

export const imagesGenerateStudioHandler = protectedProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input }) => {
    const prompt = parseString(input.get("prompt"))
    const ethnicityRaw = parseString(input.get("ethnicity"))
    const height = parseNumber(input.get("height"))
    const age = parseNumber(input.get("age"))
    const categoryRaw = parseString(input.get("category"))
    const aspectRatioRaw = parseString(input.get("aspectRatio"))
    const modelRaw = parseString(input.get("model"))

    if (!prompt)
      throw new TRPCError({ code: "BAD_REQUEST", message: "Prompt requis" })

    const ethnicity = EthnicitySchema.parse(ethnicityRaw)
    const category = StudioCategorySchema.parse(categoryRaw)
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
    if (files.length === 0)
      throw new TRPCError({ code: "BAD_REQUEST", message: "Images requises" })

    const garmentUrls: string[] = []
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer())
      const url = await uploadImage(
        `uploads/${crypto.randomUUID()}-${file.name}`,
        buf,
        file.type,
      )
      garmentUrls.push(url)
    }

    const catLabel = STUDIO_CATEGORIES[category].toLowerCase()
    const ethLabel = ethnicity.toLowerCase()

    const system =
      "Professional high-end fashion photography. High quality studio lighting. Neutral background. Subject must wear the exact clothing from reference images."
    const userText = `A high-quality studio photo of a ${ethLabel} ${catLabel}, ${age} years old, ${height}cm tall. Subject is wearing the clothes from the references. ${prompt}`

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

    const publicUrl = await uploadImage(
      `images/${crypto.randomUUID()}.png`,
      bytes,
      "image/png",
    )

    const row = await db.generatedImages.create({
      data: {
        prompt: userText,
        model,
        requestId,
        aspectRatio,
        width: size.width,
        height: size.height,
        mimeType: "image/png",
        imageUrl: publicUrl,
        objectKey: "",
      },
    })

    return { image: row, usage }
  })
