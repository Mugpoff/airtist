import { publicProcedure } from "../trpc"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../utils/image-models"
import {
  STUDIO_BACKGROUNDS,
  STUDIO_CATEGORIES,
} from "../utils/studio-constants"

export const imagesModelsHandler = publicProcedure.query(() => {
  return {
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
})
