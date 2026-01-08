import { imagesByIdHandler } from "../handlers/images/by-id"
import { imagesDeleteHandler } from "../handlers/images/delete"
import { imagesGenerateStudioHandler } from "../handlers/images/generate-studio"
import { imagesListHandler } from "../handlers/images/list"
import { imagesModelsHandler } from "../handlers/images/models"
import { createTRPCRouter } from "../trpc"

export const imagesRouter = createTRPCRouter({
  list: imagesListHandler,
  byId: imagesByIdHandler,
  generateStudio: imagesGenerateStudioHandler,
  delete: imagesDeleteHandler,
  models: imagesModelsHandler,
})
