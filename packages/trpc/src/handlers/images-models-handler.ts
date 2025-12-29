import { cacheClient } from "@repo/cache"
import { publicProcedure } from "../trpc"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../utils/image-models"
import {
  STUDIO_BACKGROUNDS,
  STUDIO_CATEGORIES,
} from "../utils/studio-constants"

export const imagesModelsHandler = publicProcedure.query(async () => {
  try {
    const cached = await cacheClient.models.get()
    if (cached) return JSON.parse(cached)
  } catch {}

  const result = {
    defaultModel: DEFAULT_IMAGE_MODEL,
    models: ImageModelSchema.options,
    categories: Object.entries(STUDIO_CATEGORIES).map(([id, label]) => ({
      id,
      label,
    })),
    backgrounds: Object.entries(STUDIO_BACKGROUNDS).map(([id, label]) => ({
      id,
      label,
    })),
  }

  try {
    await cacheClient.models.set(JSON.stringify(result))
  } catch {}

  return result
})
