import { publicProcedure } from "../trpc"
import { DEFAULT_IMAGE_MODEL, ImageModelSchema } from "../utils/image-models"

export const imagesModelsHandler = publicProcedure.query(() => {
  return {
    defaultModel: DEFAULT_IMAGE_MODEL,
    models: ImageModelSchema.options,
  }
})
