import { cacheClient } from "@repo/cache"
import { config } from "@repo/config"
import { publicProcedure } from "../../trpc"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../../utils/image-models"
import { STUDIO_BACKGROUNDS } from "../../utils/studio-constants"

export const imagesModelsHandler = publicProcedure.query(async () => {
  try {
    const cached = await cacheClient.models.get()
    if (cached) return JSON.parse(cached)
  } catch {}

  const result = {
    defaultModel: DEFAULT_IMAGE_MODEL,
    promptDefault: config.generationSettings.prompt.default,
    models: ImageModelSchema.options,
    categories: config.generationSettings.preset.values.map((id) => ({
      id,
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
