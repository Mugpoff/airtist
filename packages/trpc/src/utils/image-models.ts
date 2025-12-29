import { z } from "zod"

export const ImageModelSchema = z.enum([
  "google/gemini-2.5-flash-image",
  "google/gemini-3-pro-image-preview",
])

export type ImageModel = z.infer<typeof ImageModelSchema>

export const DEFAULT_IMAGE_MODEL: ImageModel =
  "google/gemini-3-pro-image-preview"
